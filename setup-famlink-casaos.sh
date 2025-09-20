#!/bin/bash
# setup-famlink-casaos.sh - Setup script for CasaOS deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="famlink"
APP_DIR="/DATA/AppData/${APP_NAME}"
DOMAIN="test-famlink.spoons.dk"

echo -e "${BLUE}🚀 Setting up FamLink on CasaOS${NC}"

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  Running as root. Consider using a regular user with sudo.${NC}"
fi

# Create application directory
echo -e "${BLUE}📁 Creating application directory...${NC}"
sudo mkdir -p "${APP_DIR}"
sudo chown -R $(whoami):$(whoami) "${APP_DIR}"
cd "${APP_DIR}"

# Create directory structure
mkdir -p {current,deployments,backups}
mkdir -p current/{storage/{app/public,logs,framework/{cache,sessions,views}},bootstrap/cache,database}

# Set permissions
chmod -R 775 current/storage current/bootstrap/cache

# Create SQLite database
touch current/database/database.sqlite
chmod 664 current/database/database.sqlite

echo -e "${GREEN}✅ Directory structure created${NC}"

# Generate application key
echo -e "${BLUE}🔑 Would you like to generate a new Laravel application key? (y/N)${NC}"
read -r generate_key
if [[ $generate_key =~ ^[Yy]$ ]]; then
    APP_KEY=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated APP_KEY: base64:${APP_KEY}${NC}"
    echo -e "${YELLOW}💾 Save this key for your .env.production file!${NC}"
fi

# Create production environment file
echo -e "${BLUE}📝 Creating production environment file...${NC}"
cat > .env.production << EOF
APP_NAME="FamLink"
APP_ENV=production
APP_KEY=base64:${APP_KEY:-CHANGE_ME_GENERATE_NEW_KEY}
APP_DEBUG=false
APP_URL=https://${DOMAIN}
APP_TIMEZONE=Europe/Copenhagen

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

# SQLite Database (simple setup)
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

# Cache and Session
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=${DOMAIN}

# Queue (sync for simple setup)
QUEUE_CONNECTION=sync

# Mail (adjust as needed)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@${DOMAIN}"
MAIL_FROM_NAME="FamLink"

# File uploads
UPLOAD_MAX_FILESIZE=10M
POST_MAX_SIZE=10M
EOF

echo -e "${GREEN}✅ Environment file created at ${APP_DIR}/.env.production${NC}"

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v "docker compose" &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are available${NC}"

# Create nginx-proxy-manager network if it doesn't exist
if ! docker network ls | grep -q "nginx-proxy-manager"; then
    echo -e "${BLUE}🌐 Creating nginx-proxy-manager network...${NC}"
    docker network create nginx-proxy-manager || true
fi

# Setup SSL certificate directory (for Let's Encrypt)
sudo mkdir -p /DATA/AppData/nginx-proxy-manager/letsencrypt
sudo chown -R $(whoami):$(whoami) /DATA/AppData/nginx-proxy-manager

# Create backup script
echo -e "${BLUE}💾 Creating backup script...${NC}"
cat > backup-famlink.sh << 'EOF'
#!/bin/bash
# Backup script for FamLink

BACKUP_DIR="/DATA/AppData/famlink/backups"
APP_DIR="/DATA/AppData/famlink/current"
DATE=$(date +%Y%m%d-%H%M%S)

echo "📦 Creating backup: $DATE"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
if [ -f "$APP_DIR/database/database.sqlite" ]; then
    cp "$APP_DIR/database/database.sqlite" "$BACKUP_DIR/database-$DATE.sqlite"
fi

# Backup storage
tar -czf "$BACKUP_DIR/storage-$DATE.tar.gz" -C "$APP_DIR" storage/

# Keep only last 7 backups
find "$BACKUP_DIR" -name "database-*.sqlite" -type f -mtime +7 -delete
find "$BACKUP_DIR" -name "storage-*.tar.gz" -type f -mtime +7 -delete

echo "✅ Backup completed: $DATE"
EOF

chmod +x backup-famlink.sh

# Create maintenance script
echo -e "${BLUE}🔧 Creating maintenance script...${NC}"
cat > maintenance.sh << 'EOF'
#!/bin/bash
# Maintenance script for FamLink

APP_DIR="/DATA/AppData/famlink/current"

case "$1" in
    "logs")
        echo "📋 Application logs:"
        docker compose -f "$APP_DIR/docker-compose.yml" logs -f
        ;;
    "restart")
        echo "🔄 Restarting application..."
        cd "$APP_DIR"
        docker compose restart
        ;;
    "status")
        echo "📊 Application status:"
        cd "$APP_DIR"
        docker compose ps
        ;;
    "update-ssl")
        echo "🔒 SSL certificate will be handled by Nginx Proxy Manager"
        echo "Please configure SSL in the Nginx Proxy Manager web interface"
        ;;
    *)
        echo "Usage: $0 {logs|restart|status|update-ssl}"
        exit 1
        ;;
esac
EOF

chmod +x maintenance.sh

echo -e "${GREEN}✅ Maintenance scripts created${NC}"

# Final instructions
echo -e "${GREEN}"
echo "🎉 FamLink CasaOS setup completed!"
echo
echo "📋 Next steps:"
echo "1. Configure your GitHub repository secrets:"
echo "   - CASAOS_HOST: $(hostname -I | awk '{print $1}')"
echo "   - CASAOS_USERNAME: $(whoami)"
echo "   - SSH_PRIVATE_KEY: Your SSH private key"
echo "   - SSH_PORT: 22"
echo
echo "2. Configure Nginx Proxy Manager:"
echo "   - Domain: ${DOMAIN}"
echo "   - Forward to: famlink-app:80"
echo "   - Enable SSL certificate"
echo
echo "3. Update DNS to point ${DOMAIN} to your public IP"
echo
echo "4. Push your code to trigger deployment"
echo
echo "📁 Application directory: ${APP_DIR}"
echo "📝 Environment file: ${APP_DIR}/.env.production"
echo "💾 Backup script: ${APP_DIR}/backup-famlink.sh"
echo "🔧 Maintenance: ${APP_DIR}/maintenance.sh"
echo
echo "🔧 Useful commands:"
echo "   ./backup-famlink.sh                 # Create backup"
echo "   ./maintenance.sh logs               # View logs"
echo "   ./maintenance.sh restart            # Restart app"
echo "   ./maintenance.sh status             # Check status"
echo -e "${NC}"

# Optional: Run backup script daily
echo -e "${BLUE}📅 Would you like to set up daily backups? (y/N)${NC}"
read -r setup_cron
if [[ $setup_cron =~ ^[Yy]$ ]]; then
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * ${APP_DIR}/backup-famlink.sh >> ${APP_DIR}/backup.log 2>&1") | crontab -
    echo -e "${GREEN}✅ Daily backup scheduled at 2:00 AM${NC}"
fi

echo -e "${BLUE}🚀 Setup complete! Ready for deployment.${NC}"