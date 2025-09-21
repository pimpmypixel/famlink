#!/bin/bash
set -e

echo "🚀 Starting FamLink application..."

# Wait for database to be ready (if using external DB)
if [ -n "$DB_HOST" ] && [ "$DB_CONNECTION" != "sqlite" ]; then
    echo "⏳ Waiting for database connection..."
    while ! php artisan migrate:status > /dev/null 2>&1; do
        echo "Database not ready, waiting..."
        sleep 2
    done
    echo "✅ Database connection established"
fi

# Run fresh migrations and seeding
echo "🗄️ Running fresh database migration and seeding..."
php artisan migrate:fresh --force --seed

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Optimizing Laravel for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Set proper permissions
echo "🔒 Setting proper permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Start supervisord (which manages nginx and php-fpm)
echo "🌐 Starting web services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf