# Route Debugging Tools

This application includes comprehensive route debugging tools to help identify issues with routes in production environments.

## Available Tools

### 1. Web Debug Endpoint
Access `/debug/routes` in your browser to get a comprehensive overview of:
- Core service status (Database, Cache, Storage)
- Route registration status
- Environment variable checks
- Onboarding controller verification
- Sample of registered routes

### 2. Artisan Command
Run `php artisan debug:routes` for command-line debugging:
```bash
# Basic route debugging
php artisan debug:routes

# Include onboarding-specific checks
php artisan debug:routes --check-onboarding
```

### 3. Pest Route Testing
The application uses `spatie/pest-plugin-route-testing` for automated route testing:
```bash
# Run route tests
php artisan test --filter=RouteTest
```

## Troubleshooting Production Issues

When the deployed environment fails with route-related errors:

1. **Check the web debug endpoint**: Visit `https://your-domain.com/debug/routes`
2. **Run the artisan command**: `php artisan debug:routes --check-onboarding`
3. **Verify environment variables**: Ensure all required API keys and database settings are set
4. **Check route registration**: Confirm all routes are properly registered with correct middleware

## Common Issues

### Onboarding Route Failing
If `/api/onboarding/question` fails:
- Check that `OnboardingController` exists and has `getQuestion` method
- Verify API middleware is properly configured
- Ensure VIZRA_API_KEY and MISTRAL_API_KEY are set
- Check database connectivity

### Environment Variables
Required environment variables:
- `APP_ENV`
- `APP_URL`
- `DB_CONNECTION`
- `VIZRA_API_KEY` (for AI agent functionality)
- `MISTRAL_API_KEY` (for AI responses)

## Debug Output Example

```
🔍 Route Debugging Tool
========================

Testing Core Services:
  ✅ Database: Connected
  ✅ Cache: Working
  ✅ Storage: Working

Testing Critical Routes:
  ✅ GET /api/onboarding/question → App\Http\Controllers\OnboardingController@getQuestion [api, api]
  ✅ POST /api/onboarding/answer → App\Http\Controllers\OnboardingController@submitAnswer [api, api]

Testing Onboarding-Specific Routes:
  ✅ OnboardingController exists
  ✅ getQuestion method exists

Environment Variables:
  ✅ APP_ENV: Set
  ⚠️  VIZRA_API_KEY: Not set
```

## Security Note

The debug routes are intended for development and debugging purposes. Consider restricting access to these endpoints in production environments.