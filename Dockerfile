# ==============================
# Stage 1: PHP dependencies
# ==============================
FROM composer:2 AS vendor

WORKDIR /app

# Install GD extension required by some packages
RUN apk add --no-cache --virtual .build-deps \
        freetype-dev libjpeg-turbo-dev libpng-dev \
    && apk add --no-cache \
        libpng libjpeg-turbo freetype \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && apk del .build-deps

# Copy only composer files (cache-friendly)
COPY composer.json composer.lock ./

# Install PHP dependencies optimized for production
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts


# ==============================
# Stage 2: Build Node.js assets
# ==============================
FROM php:8.4-cli AS node-builder

# Install system dependencies and PHP extensions needed for Laravel commands
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libsqlite3-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) mbstring pdo pdo_sqlite pdo_pgsql bcmath gd xml zip \
    && apt-get remove -y libpng-dev libjpeg-dev libfreetype6-dev libonig-dev libxml2-dev libzip-dev libsqlite3-dev libpq-dev \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash && \
    cp ~/.bun/bin/bun /usr/local/bin/bun && \
    cp ~/.bun/bin/bunx /usr/local/bin/bunx && \
    chmod +x /usr/local/bin/bun /usr/local/bin/bunx

WORKDIR /app

# Copy only lock and manifest files first (better cache)
COPY package*.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy sources needed for build
COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts tsconfig.json* ./

# Copy PHP application files needed for wayfinder
COPY app/ app/
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY database/ database/
COPY routes/ routes/
COPY composer.json composer.lock artisan ./
# Copy .env.example and set a dummy APP_KEY for build
COPY .env.example .env
RUN sed -i 's/APP_KEY=/APP_KEY=base64:dummy_key_for_build_only/' .env

# Copy vendor directory from vendor stage
COPY --from=vendor /app/vendor ./vendor

# Create Laravel storage directories with full structure
RUN mkdir -p storage/framework/{cache/data,sessions,views} storage/logs bootstrap/cache && \
    chmod -R 777 storage bootstrap/cache

# Setup Laravel environment - skip key generation for build
# RUN sed -i 's/CACHE_STORE=.*/CACHE_STORE=file/' .env && \
#     php artisan key:generate

# Try to run wayfinder command to see the error
RUN php artisan wayfinder:generate || echo "Wayfinder failed, continuing..."

# Build production assets
ENV NODE_ENV=production
RUN bunx vite build


# ==============================
# Stage 3: Application runtime
# ==============================
FROM php:8.4-fpm-alpine AS runtime

# Install runtime + build deps in one go
RUN apk add --no-cache \
        bash nginx curl git supervisor tzdata \
    && apk add --no-cache --virtual .build-deps \
        freetype-dev libjpeg-turbo-dev libpng-dev \
        oniguruma-dev libxml2-dev postgresql-dev sqlite-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo pdo_pgsql pdo_sqlite mbstring exif pcntl bcmath gd opcache \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/* /tmp/*

# OPcache production tuning
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.revalidate_freq=0'; \
} > /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Create required dirs (storage, cache) in one step
RUN mkdir -p \
    storage/logs storage/framework/{cache,sessions,views} \
    bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Copy app source (filtered by .dockerignore)
COPY . .

# Copy build artifacts & vendor
COPY --from=node-builder /app/public/build ./public/build
COPY --from=vendor /app/vendor ./vendor

# Copy config and scripts
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/start.sh /start.sh

# Set timezone and mark start script executable
RUN ln -snf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime \
    && echo Europe/Copenhagen > /etc/timezone \
    && chmod +x /start.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["/start.sh"]
