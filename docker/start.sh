#!/bin/bash
# docker/start.sh - Startup script for FamLink Laravel app

set -e

echo "🚀 Starting FamLink application..."

# Wait for database to be ready
DB_CONNECTION=$(grep "^DB_CONNECTION=" /var/www/html/.env | cut -d'=' -f2)

if [ "$DB_CONNECTION" = "pgsql" ]; then
    echo "⏳ Waiting for PostgreSQL database..."
    until php artisan tinker --execute="DB::connection()->getPdo()" 2>/dev/null; do
        echo "PostgreSQL not ready, waiting 5 seconds..."
        sleep 5
    done
    echo "✅ PostgreSQL is ready!"
elif [ "$DB_CONNECTION" = "sqlite" ]; then
    echo "📝 Setting up SQLite database..."
    DB_PATH=$(grep "^DB_DATABASE=" /var/www/html/.env | cut -d'=' -f2)
    if [ ! -f "$DB_PATH" ]; then
        echo "📝 Creating SQLite database..."
        mkdir -p $(dirname "$DB_PATH")
        touch "$DB_PATH"
        chmod 664 "$DB_PATH"
        chown www-data:www-data "$DB_PATH"
    fi
    echo "✅ SQLite is ready!"
fi

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

echo "🔧 Running Laravel optimization commands..."

# Clear any existing cached config/routes/views
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run migrations
echo "📊 Running database migrations..."
php artisan migrate --force

# Create storage symlink
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Cache configuration for better performance
echo "⚡ Optimizing Laravel for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Set proper permissions
echo "🔒 Setting file permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create log directory if it doesn't exist
mkdir -p /var/www/html/storage/logs
touch /var/www/html/storage/logs/laravel.log
chown www-data:www-data /var/www/html/storage/logs/laravel.log

echo "✅ Laravel application is ready!"
echo "🌍 Starting services with Supervisord..."

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf