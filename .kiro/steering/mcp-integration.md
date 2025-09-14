# MCP Server Integration Guidelines

## Available MCP Servers

You have access to several powerful MCP servers that should be leveraged throughout development:

### Laravel Boost
- **Purpose**: Laravel-specific development tooling
- **Key Tools**: 
  - `database-schema` - Read database structure
  - `list-routes` - View all application routes
  - `read-log-entries` - Check application logs
  - `application-info` - Get comprehensive app information
  - `browser-logs` - Frontend debugging
  - `tinker` - Execute PHP code in Laravel context
  - `database-query` - Run read-only SQL queries
  - `search-docs` - Search Laravel ecosystem documentation

### Herd
- **Purpose**: Local development environment management
- **Key Tools**:
  - `get_site_information` - Current site configuration
  - `get_all_sites` - List all Herd sites
  - `secure_or_unsecure_site` - HTTPS management
  - `isolate_or_unisolate_site` - PHP version isolation

### Browser MCP
- **Purpose**: Browser automation and testing
- **Key Tools**:
  - `browser_navigate` - Navigate to URLs
  - `browser_snapshot` - Capture page state
  - `browser_click` - Interact with elements
  - `browser_get_console_logs` - Debug frontend issues

### GitHub
- **Purpose**: Repository and project management
- **Key Tools**:
  - Repository operations (create, fork, star)
  - Issue and PR management
  - Code search across GitHub
  - Workflow automation
  - Notifications and reviews

## Integration Best Practices

### Always Start with Context
1. **Use `application-info`** at the beginning of each session to understand:
   - Laravel version and PHP version
   - Installed packages and their versions
   - Available Eloquent models
   - Database configuration

2. **Check `database-schema`** when working with data:
   - Understand table relationships
   - Verify column types and constraints
   - Check indexes and foreign keys

3. **Use `list-routes`** for routing work:
   - Understand existing route structure
   - Avoid route conflicts
   - Follow naming conventions

### Development Workflow Integration

#### Database Operations
- Always use `database-schema` before creating migrations
- Use `database-query` for data exploration
- Check `read-log-entries` for database errors

#### Frontend Development
- Use `browser_navigate` to test pages
- Capture `browser_snapshot` for UI debugging
- Check `browser_get_console_logs` for JavaScript errors
- Use `browser-logs` from Laravel Boost for server-side frontend logs

#### Documentation and Learning
- Use `search-docs` for Laravel ecosystem questions
- Search for package-specific documentation based on installed packages
- Always reference version-specific documentation

### Error Handling and Debugging
1. **Check logs first**: Use `read-log-entries` and `browser-logs`
2. **Verify environment**: Use `get_site_information` from Herd
3. **Test in browser**: Use Browser MCP tools for frontend issues
4. **Use tinker**: Execute PHP code to debug backend issues

## CLI Command Observation

### Always Monitor Command Exits
When executing CLI commands, always:

1. **Check exit codes**: Verify commands completed successfully (exit code 0)
2. **Read output carefully**: Look for warnings, errors, or important information
3. **Handle failures gracefully**: If a command fails, investigate and retry with corrections
4. **Use appropriate tools**: Prefer MCP tools over raw CLI when available

### Common Command Patterns
```bash
# Always check if commands succeed
php artisan migrate
# If exit code != 0, check logs and database schema

composer install
# If fails, check composer.json and dependencies

bun run dev
# Monitor for compilation errors and warnings
```

### Error Recovery
- If `php artisan` commands fail, use `read-log-entries` to diagnose
- If database commands fail, check `database-schema` and connections
- If frontend builds fail, use `browser-logs` and console tools
- If Herd issues occur, use `get_site_information` to verify configuration

## Auto-Approved Operations
The following operations are pre-approved for efficiency:
- Database schema reading
- Route listing
- Log reading
- Application info gathering
- Site information retrieval
- Browser navigation and console log retrieval

## Integration Examples

### Starting a New Feature
1. `application-info` - Understand current state
2. `database-schema` - Check existing tables
3. `list-routes` - Review routing structure
4. Create migrations, models, controllers
5. `browser_navigate` - Test the feature
6. `browser_get_console_logs` - Check for errors

### Debugging Issues
1. `read-log-entries` - Check recent errors
2. `browser-logs` - Check frontend logs
3. `database-query` - Verify data state
4. `browser_snapshot` - Capture current UI state
5. Use `tinker` to test specific code paths

### Deployment Preparation
1. `database-schema` - Verify migrations are complete
2. `list-routes` - Ensure all routes are properly defined
3. `browser_navigate` - Test critical user flows
4. Check `get_site_information` for environment configuration