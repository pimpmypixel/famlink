# MCP Server Usage Guide for Famlink

## Overview
Famlink uses multiple Model Context Protocol (MCP) servers to enhance development capabilities. This guide explains how to effectively use each MCP server for Famlink development.

## Laravel Boost MCP Server
**Purpose**: Laravel-specific development tooling and application insights

### Essential Commands for Famlink

#### Application Information
```bash
# Get comprehensive application state
application-info
```
**When to use**: At the start of any development session to understand current packages, Laravel version, and application structure.

#### Database Schema Inspection
```bash
# View current database structure
database-schema
```
**When to use**: Before creating migrations, when working with models, or when debugging database-related issues.

#### Route Analysis
```bash
# List all application routes
list-routes
```
**When to use**: When adding new routes, debugging routing issues, or understanding the current API structure.

#### Log Monitoring
```bash
# Check recent application logs
read-log-entries
```
**When to use**: When debugging errors, checking for failed operations, or monitoring application health.

#### PHP Code Execution
```bash
# Execute PHP code in Laravel context
tinker
```
**When to use**: Testing model relationships, debugging complex queries, or verifying application logic.

#### Documentation Search
```bash
# Search Laravel ecosystem documentation
search-docs queries="['inertia forms', 'spatie permissions']"
```
**When to use**: When implementing new Laravel features, working with packages, or needing version-specific guidance.

## Browser MCP Server
**Purpose**: Web automation, testing, and frontend debugging

### Essential Commands for Famlink

#### Page Navigation
```bash
# Navigate to application pages
browser_navigate url="https://famlink.test/timeline"
```
**When to use**: Testing new pages, verifying routing, or checking page load behavior.

#### UI State Capture
```bash
# Capture current page state
browser_snapshot
```
**When to use**: Debugging UI issues, verifying component rendering, or documenting current state.

#### Console Log Monitoring
```bash
# Check browser console for errors
browser_get_console_logs
```
**When to use**: Debugging JavaScript errors, monitoring React warnings, or checking for console output.

## GitHub MCP Server
**Purpose**: Repository management, code search, and collaboration

### Essential Commands for Famlink

#### Repository Operations
- Create and manage issues
- Handle pull requests
- Search codebase
- Monitor repository activity

**When to use**: Managing project issues, code reviews, or searching for existing implementations.

## shadcn MCP Server
**Purpose**: UI component management and discovery

### Essential Commands for Famlink

#### Component Search
- Find available UI components
- Check component documentation
- Install new components

**When to use**: When adding new UI components or exploring available design system options.

## Herd MCP Server
**Purpose**: Local development environment management

### Essential Commands for Famlink

#### Site Information
```bash
# Check current site configuration
get_site_information
```
**When to use**: Verifying local development setup or troubleshooting environment issues.

#### Site Management
- Enable/disable HTTPS
- Check PHP version isolation
- Monitor site status

**When to use**: Managing local development environment or troubleshooting setup issues.

## Development Workflow Integration

### Starting a New Feature
1. **Check Application State**
   ```bash
   application-info
   ```
   Understand current packages and Laravel version.

2. **Review Database Structure**
   ```bash
   database-schema
   ```
   Check existing tables and relationships.

3. **Verify Current Routes**
   ```bash
   list-routes
   ```
   Understand existing API endpoints.

4. **Test in Browser**
   ```bash
   browser_navigate url="https://famlink.test"
   ```
   Verify current application state.

### Debugging Issues
1. **Check Application Logs**
   ```bash
   read-log-entries
   ```
   Look for Laravel-specific errors.

2. **Monitor Browser Console**
   ```bash
   browser_get_console_logs
   ```
   Check for JavaScript/React errors.

3. **Inspect Database State**
   ```bash
   database-query query="SELECT * FROM timeline_items LIMIT 5;"
   ```
   Verify data integrity.

4. **Test Code Logic**
   ```php
   // Use tinker to test
   $user = User::first();
   $user->timelineItems;
   ```
   Debug model relationships and logic.

### Implementing Timeline Features
1. **Check Current Schema**
   ```bash
   database-schema filter="timeline_items"
   ```
   Understand timeline table structure.

2. **Search Documentation**
   ```bash
   search-docs queries="['inertia file upload', 'laravel file storage']"
   ```
   Find implementation guidance.

3. **Test File Upload**
   ```bash
   browser_navigate url="https://famlink.test/timeline/create"
   ```
   Verify upload interface.

4. **Monitor Logs During Development**
   ```bash
   read-log-entries
   ```
   Check for upload-related errors.

## Best Practices

### Always Start with Context
- Use `application-info` at the beginning of each session
- Check `database-schema` before database operations
- Use `list-routes` when working with APIs

### Error Investigation Flow
1. **Laravel Logs**: `read-log-entries`
2. **Browser Console**: `browser_get_console_logs`
3. **Database State**: `database-query` or `database-schema`
4. **Code Testing**: `tinker` for logic verification

### Documentation Search Strategy
- Use multiple specific queries
- Include package names when relevant
- Search before implementing complex features

### Performance Monitoring
- Use `read-log-entries` to monitor query performance
- Check `browser_get_console_logs` for frontend performance issues
- Use `database-query` with EXPLAIN for query optimization

## Troubleshooting MCP Issues

### Connection Problems
1. **Check Environment Variables**
   - Verify `.env` file has required tokens
   - Ensure Docker is running for GitHub MCP
   - Check network connectivity

2. **Restart Services**
   - Restart Kiro IDE
   - Check MCP server status in Kiro interface
   - Verify local development environment

3. **Configuration Issues**
   - Check `.kiro/settings/mcp.json`
   - Verify token validity
   - Update MCP server configurations

### Common Error Scenarios
- **GitHub Token Expired**: Regenerate token with proper scopes
- **Docker Not Running**: Start Docker Desktop
- **Laravel Not Available**: Check `php artisan` commands work
- **Browser Issues**: Verify local development server is running

## Integration with Development Commands

### Pre-commit Checks
```bash
# Check application state
application-info

# Verify database integrity
database-schema

# Check for errors
read-log-entries
```

### Testing Workflow
```bash
# Test specific functionality
browser_navigate url="https://famlink.test/timeline"

# Check for console errors
browser_get_console_logs

# Verify data
database-query query="SELECT COUNT(*) FROM timeline_items;"
```

### Deployment Preparation
```bash
# Final state check
application-info

# Route verification
list-routes

# Log review
read-log-entries
```

This MCP integration provides powerful tools for efficient Famlink development. Always leverage these tools to maintain development velocity and code quality.