# Workspace Setup and Team Guidelines

## Kiro IDE Configuration

This workspace is configured for optimal development with Kiro IDE and includes:

### MCP Server Configuration
- **Location**: `.kiro/settings/mcp.json` (workspace-level, shared with team)
- **Purpose**: Provides enhanced development capabilities through Model Context Protocol
- **Auto-reload**: MCP servers reconnect automatically when configuration changes

### Steering Files
- **Location**: `.kiro/steering/` directory
- **Purpose**: Provide context and guidelines for AI assistance
- **Files**:
  - `tech.md` - Technology stack and development commands
  - `structure.md` - Project structure and conventions
  - `product.md` - Product overview and requirements
  - `mcp-integration.md` - MCP server usage guidelines
  - `workspace-setup.md` - This file

### Specs Directory
- **Location**: `.kiro/specs/` directory
- **Purpose**: Feature specifications and implementation plans
- **Current Specs**: `co-parenting-timeline/` - Main application feature spec

## Team Onboarding

### Prerequisites
- Kiro IDE installed
- Docker installed (for GitHub MCP server)
- Bun installed (JavaScript package manager)
- PHP 8.2+ and Composer installed
- Laravel Herd installed (recommended for local development)

### Setup Steps
1. **Clone Repository**: Standard git clone
2. **Environment Setup**: 
   ```bash
   cp .env.example .env
   # Add your GitHub personal access token to .env
   ```
3. **Install Dependencies**:
   ```bash
   composer install
   bun install
   ```
4. **Database Setup**:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```
5. **Start Development**:
   ```bash
   composer dev  # Starts Laravel, Vite, and queue worker
   ```

### Kiro IDE Features

#### MCP Servers
- Automatically configured when opening workspace
- No additional setup required (credentials from `.env`)
- Check MCP Server view in Kiro for connection status

#### Specs and Tasks
- Use specs for feature development workflow
- Click "Start task" next to task items in `tasks.md` files
- Kiro will guide implementation based on requirements and design

#### Agent Hooks
- Available in Explorer view under "Agent Hooks"
- Can create custom automation triggers
- Examples: Auto-run tests on save, update translations

## Development Workflow

### Starting New Features
1. **Create Spec**: Use Kiro to create new spec in `.kiro/specs/`
2. **Requirements**: Define user stories and acceptance criteria
3. **Design**: Create technical design document
4. **Tasks**: Break down into implementation tasks
5. **Execute**: Use Kiro to execute tasks incrementally

### Daily Development
1. **Start Session**: Kiro automatically loads workspace context
2. **Check MCP Status**: Verify all servers are connected
3. **Use MCP Tools**: Leverage Laravel Boost, Browser, GitHub tools
4. **Follow Steering**: Reference steering files for guidelines

### Code Quality
- **PHP**: Laravel Pint for formatting (`./vendor/bin/pint`)
- **JavaScript**: Prettier and ESLint (`bun run format`, `bun run lint`)
- **Testing**: Pest for PHP tests (`composer test`)
- **TypeScript**: Strict mode enabled (`bun run types`)

## Troubleshooting

### MCP Server Issues
1. Check `.env` file has required variables
2. Verify Docker is running (for GitHub MCP)
3. Check MCP Logs in Kiro IDE
4. Restart Kiro IDE to reload configuration

### Development Environment
1. Use `get_site_information` MCP tool to check Herd status
2. Check `read-log-entries` for Laravel errors
3. Use `browser_get_console_logs` for frontend issues
4. Verify database with `database-schema` MCP tool

### Common Commands
```bash
# Check application status
php artisan about

# Clear caches
php artisan optimize:clear

# Reset database
php artisan migrate:fresh --seed

# Check code quality
./vendor/bin/pint --test
bun run format:check
```

## Best Practices

### File Organization
- Follow Laravel conventions for backend
- Use kebab-case for React component files
- Keep steering files updated with project changes
- Update specs when requirements change

### Git Workflow
- `.kiro/settings/` and `.kiro/steering/` are tracked
- `.kiro/specs/` and `.kiro/logs/` are gitignored
- Environment variables stay in `.env` (gitignored)
- Commit MCP configuration changes for team

### AI Assistance
- Reference steering files in prompts for context
- Use specs for complex feature development
- Leverage MCP tools for debugging and exploration
- Keep documentation updated for better AI assistance

This workspace setup ensures consistent development experience across the team while leveraging Kiro IDE's advanced capabilities.