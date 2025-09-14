# Technology Stack

## Backend
- **Framework**: Laravel 12.0 (PHP 8.2+)
- **Database**: SQLite (default), configurable for other databases
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

## Key Dependencies
- **inertiajs/inertia-laravel**: SPA-like experience
- **laravel/wayfinder**: Type-safe routing
- **laravel/boost**: Development tooling
- **pestphp/pest**: Modern PHP testing
- **@radix-ui/react-***: Accessible UI primitives
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility