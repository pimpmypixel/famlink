# Design Document

## Overview

This design outlines the migration of User, Family, and TimelineItem models from auto-incrementing integer primary keys to UUID4 primary keys. The implementation leverages Laravel 12's built-in UUID support through the `HasUuids` trait and includes comprehensive data migration strategies to ensure zero data loss and minimal downtime.

The migration affects core application models and their relationships, requiring updates to database schema, Eloquent models, foreign key constraints, and related systems including Spatie Permission package integration.

## Architecture

### UUID Generation Strategy

Laravel 12 provides the `HasUuids` trait which generates UUIDv7 (ordered UUIDs) by default. However, since the requirement specifies UUID4, we will override the UUID generation method in each model to use UUID4 specifically.

**Key Components:**
- **HasUuids Trait**: Laravel's built-in trait for UUID primary key support
- **Custom UUID Generation**: Override `newUniqueId()` method to generate UUID4
- **Database Schema**: PostgreSQL UUID column type for optimal storage and indexing
- **Migration Strategy**: Multi-step migration with data preservation and rollback capability

### Database Schema Changes

**Primary Key Modifications:**
- `users.id`: `bigint` → `uuid`
- `families.id`: `bigint` → `uuid`  
- `timeline_items.id`: `bigint` → `uuid`

**Foreign Key Updates:**
- `users.family_id`: `bigint` → `uuid`
- `timeline_items.user_id`: `bigint` → `uuid`
- `timeline_items.family_id`: `bigint` → `uuid`
- `sessions.user_id`: `bigint` → `uuid`
- `model_has_permissions.model_id`: `bigint` → `uuid` (when model_type is User)
- `model_has_roles.model_id`: `bigint` → `uuid` (when model_type is User)

## Components and Interfaces

### Model Updates

#### User Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Ramsey\Uuid\Uuid;

class User extends Authenticatable
{
    use HasUuids;
    
    /**
     * Generate a new UUID4 for the model.
     */
    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }
    
    /**
     * Get the columns that should receive a unique identifier.
     */
    public function uniqueIds(): array
    {
        return ['id'];
    }
}
```

#### Family Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Family extends Model
{
    use HasUuids;
    
    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }
    
    public function uniqueIds(): array
    {
        return ['id'];
    }
}
```

#### TimelineItem Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class TimelineItem extends Model
{
    use HasUuids;
    
    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }
    
    public function uniqueIds(): array
    {
        return ['id'];
    }
}
```

### Migration Strategy

The migration will be implemented in multiple phases to ensure data integrity and provide rollback capability:

#### Phase 1: Add UUID Columns
- Add new UUID columns alongside existing integer primary keys
- Generate UUID4 values for all existing records
- Create mapping between old and new IDs

#### Phase 2: Update Foreign Key References
- Update all foreign key columns to reference new UUID values
- Maintain referential integrity throughout the process

#### Phase 3: Switch Primary Keys
- Drop old primary key constraints
- Set UUID columns as new primary keys
- Drop old integer ID columns

#### Phase 4: Update Indexes and Constraints
- Recreate indexes optimized for UUID columns
- Update foreign key constraints to reference UUID columns
- Update unique constraints where applicable

### Spatie Permission Integration

The Spatie Permission package (v6.21) supports UUID primary keys through polymorphic relationships. The `model_has_permissions` and `model_has_roles` tables use:
- `model_type`: Stores the model class name (e.g., 'App\Models\User')
- `model_id`: Stores the model's primary key value (will become UUID string)

**Configuration Updates:**
- No changes required to Spatie Permission configuration
- The package automatically handles UUID primary keys in polymorphic relationships
- Existing permission assignments will be migrated to use UUID references

## Data Models

### UUID Storage Considerations

**PostgreSQL UUID Type:**
- Native UUID support with 16-byte storage (vs 36-byte string)
- Optimized indexing and comparison operations
- Built-in UUID generation functions

**Laravel UUID Handling:**
- Automatic casting to string in Eloquent models
- JSON serialization includes UUID as string
- Route model binding works transparently with UUIDs

### Relationship Mapping

```
Family (UUID) 
├── Users (UUID) [family_id → Family.id]
└── TimelineItems (UUID) [family_id → Family.id]

User (UUID)
├── TimelineItems (UUID) [user_id → User.id]
├── Permissions [model_id → User.id, model_type → 'App\Models\User']
├── Roles [model_id → User.id, model_type → 'App\Models\User']
└── Sessions [user_id → User.id]

TimelineItem (UUID)
├── User (UUID) [user_id → User.id]
├── Family (UUID) [family_id → Family.id]
└── LinkedItems [linked_items array contains UUID references]
```

## Error Handling

### Migration Error Recovery

**Rollback Strategy:**
- Each migration step is wrapped in database transactions
- Automatic rollback on any failure during migration
- Separate rollback migration to restore integer primary keys
- Data integrity checks at each phase

**Validation Checks:**
- Verify all records have UUID values before switching primary keys
- Validate foreign key relationships after updates
- Check that no orphaned records exist
- Confirm all indexes are properly created

### Runtime Error Handling

**UUID Validation:**
- Validate UUID format in API requests
- Handle invalid UUID references gracefully
- Provide meaningful error messages for UUID-related failures

**Performance Monitoring:**
- Monitor query performance after migration
- Track any performance degradation
- Implement query optimization if needed

## Testing Strategy

### Migration Testing

**Test Scenarios:**
1. **Empty Database Migration**: Test migration on fresh database
2. **Populated Database Migration**: Test with realistic data volumes
3. **Rollback Testing**: Verify rollback migration works correctly
4. **Partial Failure Recovery**: Test recovery from mid-migration failures

**Data Integrity Tests:**
- Verify all existing data is preserved
- Confirm all relationships remain intact
- Validate that no data is lost or corrupted
- Check that UUID generation is working correctly

### Application Testing

**Model Testing:**
- Test CRUD operations with UUID primary keys
- Verify relationship queries work correctly
- Test model factories generate valid UUIDs
- Confirm API serialization includes UUIDs

**Authentication Testing:**
- Test user login/logout with UUID primary keys
- Verify session management works with UUID user references
- Test password reset functionality
- Confirm email verification works

**Permission Testing:**
- Test role and permission assignment
- Verify permission checking works with UUID models
- Test bulk permission operations
- Confirm permission inheritance works correctly

### Performance Testing

**Query Performance:**
- Benchmark common queries before and after migration
- Test join performance with UUID foreign keys
- Verify index effectiveness on UUID columns
- Monitor memory usage with UUID operations

**Load Testing:**
- Test application performance under normal load
- Verify UUID generation doesn't create bottlenecks
- Test concurrent user operations
- Monitor database connection usage

### Frontend Testing

**API Integration:**
- Test all API endpoints accept UUID parameters
- Verify frontend can handle UUID responses
- Test form submissions with UUID references
- Confirm URL routing works with UUID parameters

**User Interface:**
- Test timeline item creation and editing
- Verify family management functionality
- Test user profile operations
- Confirm search and filtering work with UUIDs

## Implementation Phases

### Phase 1: Model Preparation
- Add HasUuids trait to models
- Override newUniqueId() method for UUID4 generation
- Update model factories for testing
- Create comprehensive test suite

### Phase 2: Database Migration
- Create migration to add UUID columns
- Populate UUID values for existing records
- Create mapping tables for rollback capability
- Test migration on development data

### Phase 3: Foreign Key Migration
- Update all foreign key columns to UUID type
- Migrate foreign key data using mapping tables
- Update constraints and indexes
- Verify referential integrity

### Phase 4: Primary Key Switch
- Drop old primary key constraints
- Set UUID columns as primary keys
- Drop old integer columns and sequences
- Update all remaining indexes

### Phase 5: Application Updates
- Update API endpoints to handle UUIDs
- Modify frontend code for UUID handling
- Update documentation and examples
- Perform comprehensive testing

### Phase 6: Production Deployment
- Schedule maintenance window
- Execute migration with monitoring
- Verify application functionality
- Monitor performance and error rates