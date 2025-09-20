# Stage 1: Build Node.js assets
FROM node:20-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock* ./

# Install dependencies with Bun (if available) or npm
RUN if [ -f "bun.lock" ]; then \
        echo "Attempting to install Bun..." && \
        (npm install -g bun 2>/dev/null && echo "Bun installed successfully" && bun install) || \
        (echo "Bun installation failed, falling back to npm..." && npm ci); \
    else \
        npm ci; \
    fi

# Copy source files for building
COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts ./
COPY tailwind.config.js* ./
COPY tsconfig.json* ./
COPY postcss.config.js* ./

# Build production assets
RUN if [ -f "bun.lock" ]; then \
        (command -v bun >/dev/null 2>&1 && bun run build) || \
        npm run build; \
    else \
        npm run build; \
    fi

# Stage 2: Build PHP dependencies
FROM composer:2 AS vendor

# Install system dependencies needed for PHP extensions
RUN apk add --no-cache \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    && rm -rf /var/cache/apk/*

# Install PHP extensions needed for Composer
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd

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
    --no-cache

# Stage 3: Application runtime
FROM php:8.4-fpm-alpine AS runtime

# Install system dependencies
RUN apk add --no-cache \
    bash \
    nginx \
    curl \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    postgresql-dev \
    sqlite-dev \
    git \
    supervisor \
    tzdata \
    && rm -rf /var/cache/apk/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        opcache

# Configure OPcache for production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Set working directory
WORKDIR /var/www/html

# Create required directories
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && mkdir -p bootstrap/cache

# Copy application source
COPY . .

# Copy built assets from node-builder
COPY --from=node-builder /app/public/build ./public/build

# Copy vendor dependencies from composer stage
COPY --from=vendor /app/vendor ./vendor

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Set timezone
ENV TZ=Europe/Copenhagen
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Fix permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

# Use startup script instead of direct supervisord
CMD ["/start.sh"]