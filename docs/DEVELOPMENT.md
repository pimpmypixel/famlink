# Development Tools & Code Quality

This document outlines the development tools and code quality practices used in the Famlink project.

## Code Quality Tools

### LaraStan (PHPStan for Laravel)

Famlink uses [LaraStan](https://github.com/larastan/larastan) for static analysis and code quality assurance. LaraStan is a PHPStan extension specifically designed for Laravel applications.

#### Installation

LaraStan is already installed and configured in this project. The configuration is in `phpstan.neon`.

#### Configuration

The `phpstan.neon` file includes:
- **Analysis Level**: 5 (strictest level)
- **Paths**: `app`, `database`, `routes`, `tests`
- **Exclusions**: `vendor/`, `storage/`, `node_modules/`, etc.
- **Laravel Extensions**: Full Laravel-specific type checking

#### Usage

**Run static analysis:**
```bash
composer phpstan
```

**Run with higher memory limit (if needed):**
```bash
vendor/bin/phpstan analyse --memory-limit=512M
```

**Run on specific files:**
```bash
vendor/bin/phpstan analyse app/Models/User.php
```

#### What LaraStan Checks

LaraStan performs comprehensive static analysis including:
- **Type safety**: Parameter and return type validation
- **Property access**: Validation of model properties and relationships
- **Method calls**: Verification of method existence and signatures
- **Laravel-specific features**: Eloquent relationships, facades, helpers
- **Unused code**: Detection of unused variables and imports
- **Potential bugs**: Identification of common programming errors

#### Common Issues and Fixes

**Undefined property access:**
```php
// ❌ Error: Property not found
$user->someUndefinedProperty

// ✅ Fix: Add property to model or use correct property
$user->name // If property exists
$user->getAttribute('custom_field') // For dynamic properties
```

**Incorrect method calls:**
```php
// ❌ Error: Method not found
$user->undefinedMethod()

// ✅ Fix: Use correct method or check if it exists
$user->hasRole('admin') // If using Spatie Permission
method_exists($user, 'customMethod') // Dynamic check
```

**Type mismatches:**
```php
// ❌ Error: Argument type mismatch
function processUser(User $user) { /* ... */ }
processUser('string'); // Wrong type

// ✅ Fix: Pass correct type
$user = User::find(1);
processUser($user);
```

#### Integration with Development Workflow

**Pre-commit hooks** (recommended):
```bash
# Add to your pre-commit hook
composer phpstan
```

**CI/CD Integration** (recommended):
```yaml
# In your GitHub Actions or CI pipeline
- name: Run PHPStan
  run: composer phpstan
```

#### Performance Tips

- **Memory limits**: Use `--memory-limit=512M` for large codebases
- **Parallel processing**: Enabled by default for faster analysis
- **Incremental analysis**: Only analyze changed files when possible
- **Baseline files**: Can be used to ignore existing issues during gradual adoption

### Laravel Pint (Code Formatting)

Laravel Pint is used for consistent PHP code formatting.

#### Usage

**Format all files:**
```bash
./vendor/bin/pint
```

**Check formatting without fixing:**
```bash
./vendor/bin/pint --test
```

**Format specific files:**
```bash
./vendor/bin/pint app/Models/User.php
```

### Pest (Testing Framework)

Pest is used for unit and feature testing.

#### Usage

**Run all tests:**
```bash
composer test
```

**Run specific test file:**
```bash
php artisan test tests/Feature/UserTest.php
```

**Run tests with coverage:**
```bash
php artisan test --coverage
```

## Development Workflow

### Code Quality Checks

Before committing code, ensure:

1. **PHPStan passes**: `composer phpstan`
2. **Code is formatted**: `./vendor/bin/pint`
3. **Tests pass**: `composer test`
4. **No linting errors**: Check ESLint and Prettier

### Pre-commit Setup

Consider setting up pre-commit hooks:

```bash
#!/bin/sh
composer phpstan
./vendor/bin/pint --test
composer test
```

### IDE Integration

**VS Code / Kiro IDE:**
- Install PHPStan extension
- Configure to use project `phpstan.neon`
- Enable real-time analysis

**PHPStorm:**
- Built-in PHPStan support
- Configure inspection settings
- Enable Laravel plugin for better support

## Troubleshooting

### PHPStan Memory Issues

If you encounter memory limits:
```bash
# Increase memory limit
php -d memory_limit=1G vendor/bin/phpstan analyse

# Or use the CLI option
vendor/bin/phpstan analyse --memory-limit=1G
```

### False Positives

For legitimate false positives, add PHPStan ignore comments:
```php
/** @phpstan-ignore-next-line */
$user->dynamicProperty = 'value';
```

### Configuration Issues

If PHPStan can't find Laravel classes:
- Ensure `vendor/larastan/larastan/extension.neon` is included
- Check that Composer autoload is up to date: `composer dump-autoload`
- Verify Laravel framework is properly installed

## Contributing

When contributing to Famlink:

1. Run all code quality checks before submitting PRs
2. Fix any PHPStan issues introduced by your changes
3. Follow the established code style (enforced by Pint)
4. Add tests for new functionality
5. Update documentation for significant changes

## Resources

- [LaraStan Documentation](https://github.com/larastan/larastan)
- [PHPStan Documentation](https://phpstan.org/)
- [Laravel Pint Documentation](https://laravel.com/docs/pint)
- [Pest Documentation](https://pestphp.com/)</content>
<parameter name="filePath">/Users/andreas/Herd/famlink/docs/DEVELOPMENT.md