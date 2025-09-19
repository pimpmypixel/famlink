# Famlink Copilot Instructions Index

## Overview
This directory contains consolidated GitHub Copilot instructions for the Famlink co-parenting timeline platform. All instructions are based on the current state of the application and incorporate information from various project documentation files.

## Directory Structure

### Steering Files (`/steering/`)
High-level guidance and project context for AI assistance.

- **`famlink-copilot-instructions.md`** - Main consolidated instructions
  - Project overview and vision
  - Technology stack and architecture
  - Current implementation status
  - Key models and relationships
  - Development guidelines and conventions
  - Security and compliance requirements

### Instruction Files (`/instructions/`)
Detailed, actionable development guides.

- **`development-workflow.md`** - Step-by-step development processes
  - Starting new development sessions
  - Implementing backend/frontend features
  - Testing strategies and best practices
  - Debugging workflows
  - Code quality and deployment preparation

- **`implementation-status.md`** - Current state and roadmap
  - Completed vs. missing features
  - Implementation phases and priorities
  - Technical debt and risk mitigation
  - Success metrics and timelines

- **`mcp-usage-guide.md`** - MCP server integration
  - Laravel Boost, Browser, GitHub, shadcn, Herd servers
  - When and how to use each tool
  - Development workflow integration
  - Troubleshooting common issues

## Source Documentation Consolidated

These instructions were created by consolidating information from:

### Core Project Files
- `README.md` - Project overview, vision, and goals
- `WORKSPACE_UPDATES.md` - Recent configuration changes
- `docs/MCP_SETUP.md` - MCP server setup guide

### Steering Files
- `.kiro/steering/tech.md` - Technology stack details
- `.kiro/steering/structure.md` - Project organization
- `.kiro/steering/product.md` - Product overview
- `.kiro/steering/mcp-integration.md` - MCP usage guidelines
- `.kiro/steering/workspace-setup.md` - Development environment setup

### Specification Files
- `.kiro/specs/co-parenting-timeline/design.md` - Technical design and architecture
- `.kiro/specs/co-parenting-timeline/requirements.md` - User stories and acceptance criteria
- `.kiro/specs/co-parenting-timeline/tasks.md` - Implementation plan and current status

## Key Project Information

### Technology Stack
- **Backend**: Laravel 12.28.1 (PHP 8.4.12)
- **Frontend**: React 19.1.1 with TypeScript, Inertia.js 2.0.6
- **Database**: SQLite (dev), PostgreSQL (production)
- **Development**: Kiro IDE with MCP servers, Bun package manager

### Current Implementation Status
- ✅ Laravel Breeze authentication
- ✅ Basic timeline functionality
- ✅ Spatie Permission system
- ✅ Database schema with relationships
- ❌ Advanced filtering and search
- ❌ File attachments and notifications
- ❌ Calendar integration
- ❌ PDF export functionality

### Development Environment
- **Local URL**: https://famlink.test (Laravel Herd)
- **MCP Servers**: Laravel Boost, Browser, GitHub, shadcn, Herd
- **Package Managers**: Composer (PHP), Bun (JavaScript)
- **Testing**: Pest PHP framework
- **Code Quality**: Laravel Pint, ESLint, Prettier

## Quick Start for New Developers

1. **Read Main Instructions** → `steering/famlink-copilot-instructions.md`
2. **Check Current Status** → `instructions/implementation-status.md`
3. **Follow Development Workflow** → `instructions/development-workflow.md`
4. **Learn MCP Tools** → `instructions/mcp-usage-guide.md`

## Maintenance Notes

### Keeping Instructions Current
- Update these files when significant changes occur
- Review quarterly for accuracy
- Incorporate new team members' feedback
- Update with new MCP server capabilities

### Version Control
- These files are tracked in Git
- Update when new features are implemented
- Document breaking changes
- Maintain backward compatibility guidance

### Usage Guidelines
- Reference these files in GitHub Copilot prompts
- Use for onboarding new team members
- Consult before implementing new features
- Review when debugging complex issues

## Contact and Support

For questions about these instructions or the Famlink project:
- Check existing issues in the GitHub repository
- Review the consolidated source documentation
- Use MCP tools for current application state
- Consult team documentation in `.kiro/steering/`

---

*Last updated: Based on project state as of September 2025*
*Consolidated from 13+ documentation files across the workspace*