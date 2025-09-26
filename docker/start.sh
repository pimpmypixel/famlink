#!/bin/bash
set -e

echo "🚀 Starting FamLink application..."

# Skip SQLite cache table creation for PostgreSQL setup
echo "🗄️ Skipping cache table creation (using PostgreSQL)..."

# Run database migrations (now cache table exists)
echo "🗄️ Running database migrations..."
if php artisan migrate --force --no-interaction; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migrations failed, but continuing..."
fi

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force --no-interaction
fi

# Clear and cache config
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Set proper permissions
echo "🔒 Setting proper permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Test PHP-FPM configuration
echo "🧪 Testing PHP-FPM configuration..."
if php-fpm -t; then
    echo "✅ PHP-FPM configuration is valid"
else
    echo "❌ PHP-FPM configuration test failed"
    exit 1
fi

# Start Nginx
echo "🌐 Starting Nginx..."
nginx -g "daemon off;" &

# Wait for nginx to start
sleep 2

# Check if nginx is running
if pgrep nginx > /dev/null; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx failed to start"
    exit 1
fi

# Start PHP-FPM in foreground
echo "🐘 Starting PHP-FPM..."
echo "PHP-FPM logs will be written to /var/log/php-fpm.log"
echo "PHP error logs will be written to /var/log/php-error.log"
php-fpm
