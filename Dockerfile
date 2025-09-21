# syntax=docker/dockerfile:1

# ================================
# Stage 1: Node.js Builder
# ================================
FROM --platform=$BUILDPLATFORM node:20-alpine AS node-builder

# Install PHP for Wayfinder plugin (only what's needed)
RUN apk add --no-cache php84 php84-cli composer

WORKDIR /app

# Copy dependency files first for better caching
COPY composer.json composer.lock package*.json bun.lock* ./

# Install PHP dependencies (needed for Wayfinder)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist --no-cache

# Copy minimal source needed for Wayfinder
COPY app/ app/
COPY config/ config/
COPY routes/ routes/
COPY bootstrap/ bootstrap/
COPY artisan ./

# Generate Wayfinder types
RUN php84 artisan wayfinder:generate --with-form

# Install Node.js dependencies with fallback
RUN if [ -f "bun.lock" ] || [ -f "bun.lockb" ]; then \
        echo "Using Bun..." && \
        npm install -g bun && \
        bun install --frozen-lockfile; \
    else \
        echo "Using npm..." && \
        npm ci --only=production; \
    fi

# Copy source files needed for building
COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts tsconfig.json* tailwind.config.js* postcss.config.js* ./

# Build production assets
RUN if command -v bun >/dev/null 2>&1; then \
        bun run build; \
    else \
        npm run build; \
    fi

# ================================
# Stage 2: PHP Vendor Dependencies
# ================================
FROM --platform=$BUILDPLATFORM composer:2 AS vendor

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies optimized for production
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --no-cache \
    --classmap-authoritative

# ================================
# Stage 3: Runtime Application
# ================================
FROM --platform=$TARGETPLATFORM php:8.4-fpm-alpine AS runtime

# Install system dependencies (optimized for ARM64)
RUN apk add --no-cache \
    bash \
    nginx \
    curl \
    freetype \
    libjpeg-turbo \
    libpng \
    oniguruma \
    libxml2 \
    zip \
    unzip \
    postgresql-dev \
    sqlite-dev \
    git \
    supervisor \
    tzdata \
    icu-libs \
    && rm -rf /var/cache/apk/*

# Install PHP extensions (pre-built where possible, compiled only when necessary)
RUN apk add --no-cache --virtual .build-deps \
        freetype-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        oniguruma-dev \
        libxml2-dev \
        icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        opcache \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

# Configure OPcache for production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=60'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=0'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Configure PHP-FPM for production
RUN { \
    echo '[www]'; \
    echo 'pm = dynamic'; \
    echo 'pm.max_children = 20'; \
    echo 'pm.start_servers = 5'; \
    echo 'pm.min_spare_servers = 2'; \
    echo 'pm.max_spare_servers = 10'; \
    echo 'pm.max_requests = 500'; \
} > /usr/local/etc/php-fpm.d/zz-docker.conf

# Set working directory
WORKDIR /var/www/html

# Create required directories with proper permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Copy application source (exclude development files)
COPY --chown=www-data:www-data . .

# Copy built assets from node-builder
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build/

# Copy vendor dependencies from composer stage
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor/

# Copy configuration files
COPY --chown=www-data:www-data docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=www-data:www-data docker/supervisord.conf /etc/supervisord.conf

# Set timezone
ENV TZ=Europe/Copenhagen
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create startup script
COPY --chown=www-data:www-data docker/start.sh /start.sh
RUN chmod +x /start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

# Use startup script
CMD ["/start.sh"]

# ================================
# Stage 4: Development (optional)
# ================================
FROM runtime AS development

# Install development dependencies
RUN apk add --no-cache \
    git \
    vim \
    && rm -rf /var/cache/apk/*

# Enable development settings
ENV APP_ENV=local \
    APP_DEBUG=true

# Override CMD for development
CMD ["php-fpm"]