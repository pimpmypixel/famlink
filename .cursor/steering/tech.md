# Technology Stack

## Backend
- **Framework**: Laravel 12.0 (PHP 8.2+)
- **Database**: PostgreSQL (current), configurable for other databases
- **Authentication**: Laravel Breeze with Inertia.js
- **API**: Inertia.js for SPA-style interactions
- **Queue**: Database-based queue system
- **Testing**: Pest PHP testing framework
- **Code Quality**: Laravel Pint for code formatting

## Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Icons**: Lucide React
- **State Management**: Inertia.js for server-state
- **Routing**: Laravel Wayfinder for type-safe routing

## Development Tools
- **Package Manager**: Composer (PHP), Bun (Node.js)
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with Tailwind plugin
- **Type Checking**: TypeScript with strict mode
- **Concurrency**: Uses concurrently for running multiple dev processes

## Common Commands

### Development
```bash
# Start full development environment (server, queue, logs, vite)
composer dev

# Start with SSR support
composer dev:ssr

# Frontend only development
bun run dev

# Build for production
bun run build

# Build with SSR
bun run build:ssr
```

### Testing
```bash
# Run PHP tests
composer test
# or
php artisan test

# Type checking
bun run types
```

### Code Quality
```bash
# Format PHP code
./vendor/bin/pint

# Format frontend code
bun run format

# Check formatting
bun run format:check

# Lint and fix
bun run lint
```

### Database
```bash
# Run migrations
php artisan migrate

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

## MCP Server Integration

This project uses multiple MCP servers for enhanced development capabilities. The workspace is configured with:

### Laravel Boost MCP
- **Purpose**: Laravel-specific development tooling
- **Command**: `php artisan boost:mcp` (local Laravel command)
- **Key Tools**: `database-schema`, `list-routes`, `read-log-entries`, `application-info`, `browser-logs`, `database-query`, `tinker`

### Browser MCP
- **Purpose**: Web automation and testing
- **Command**: `npx @browsermcp/mcp@latest`
- **Key Tools**: `browser_navigate`, `browser_snapshot`, `browser_get_console_logs`

### GitHub MCP
- **Purpose**: Repository and project management
- **Command**: Docker container with GitHub API access
- **Key Tools**: Repository operations, issue/PR management, code search, workflow automation

### shadcn MCP
- **Purpose**: UI component management
- **Command**: `bunx shadcn@latest mcp`
- **Key Tools**: Component search, installation, and management

### Herd MCP
- **Purpose**: Local development environment management
- **Command**: Local PHP binary with Herd's MCP phar file
- **Key Tools**: Site information, PHP version management, HTTPS configuration

### Development Workflow
1. Always start new sessions by calling `application-info` to understand the current state
2. Use `search-docs` before implementing Laravel ecosystem features
3. Leverage `tinker` for testing code snippets before implementation
4. Check `read-log-entries` and `browser-logs` when debugging issues
5. Use `browser_navigate` and `browser_snapshot` for frontend testing
6. Use `database-schema` before creating migrations

## CLI Command Monitoring

**CRITICAL**: Always observe and wait for CLI command completion before proceeding. This includes:

### Command Exit Observation
- **PHP commands**: `php artisan *` - Wait for command completion and check exit status
- **Composer commands**: `composer *` - Monitor for successful completion
- **Bun commands**: `bun run *`, `bun install`, etc. - Ensure processes finish
- **Database commands**: `php artisan migrate*`, `php artisan db:*` - Verify completion
- **Testing commands**: `php artisan test`, `composer test` - Wait for test results

### Best Practices
- Never assume commands completed successfully without verification
- Check command output for errors or warnings
- Use appropriate error handling for failed commands
- Monitor long-running processes (dev servers, builds) for completion signals

## Key Dependencies
- **inertiajs/inertia-laravel**: SPA-like experience
- **laravel/wayfinder**: Type-safe routing
- **laravel/boost**: Development tooling and MCP integration
- **pestphp/pest**: Modern PHP testing
- **@radix-ui/react-***: Accessible UI primitives
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility