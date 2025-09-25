#!/bin/bash
set -e

echo "🚀 Starting FamLink application..."

# Create database file if it doesn't exist
touch /var/www/html/database/database.sqlite

# Set proper permissions
echo "🔒 Setting proper permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Test PHP-FPM configuration
echo "🧪 Testing PHP-FPM configuration..."
php-fpm -t

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

# Try to run migrations (with error handling)
echo "🗄️ Running database migrations..."
if php artisan migrate --force --no-interaction 2>/dev/null; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migrations failed, but continuing startup..."
fi

# Start PHP-FPM in foreground
echo "🐘 Starting PHP-FPM..."
php-fpm
