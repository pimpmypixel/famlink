# MCP Server Setup

This project uses Model Context Protocol (MCP) servers for enhanced development capabilities through Kiro IDE.

## Required Environment Variables

Copy `.env.example` to `.env` and configure the following MCP-related variables:

```bash
# GitHub MCP Server - for repository management and code search
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
```

## Getting a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with these scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `workflow` (Update GitHub Action workflows)
3. Copy the token to your `.env` file

## Available MCP Servers

The workspace is configured with these MCP servers:

- **Laravel Boost**: Laravel-specific development tools (database schema, routes, logs, tinker)
- **GitHub**: Repository management, issues, PRs, code search
- **Browser**: Web automation and testing
- **shadcn**: UI component management
- **Herd**: Local development environment management

## Troubleshooting

If MCP servers fail to connect:

1. Check your `.env` file has all required variables
2. Verify Docker is running (required for GitHub MCP server)
3. Check the MCP Logs in Kiro IDE for specific error messages
4. Restart Kiro IDE to reload MCP configuration

## Security Notes

- Never commit actual tokens to the repository
- Use environment variables for all sensitive configuration
- The `.env` file is gitignored to prevent accidental commits
- Team members need their own GitHub tokens