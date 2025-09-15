# Requirements Document

## Introduction

This feature involves migrating the User, Family, and TimelineItem models from auto-incrementing integer primary keys to UUID4 (Universally Unique Identifier version 4) primary keys. This change will improve data portability, reduce the risk of ID conflicts in distributed systems, and enhance security by making IDs non-sequential and unpredictable.

The migration affects three core models and their relationships, requiring careful handling of existing data, foreign key constraints, and related systems including authentication, permissions, and sessions.

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want the User model to use UUID4 as its primary key, so that user identifiers are globally unique and non-sequential for enhanced security.

#### Acceptance Criteria

1. WHEN the User model is accessed THEN the primary key SHALL be a UUID4 string
2. WHEN a new User is created THEN the system SHALL automatically generate a UUID4 for the primary key
3. WHEN existing User records are migrated THEN all data SHALL be preserved with new UUID4 primary keys
4. WHEN User authentication occurs THEN the system SHALL work seamlessly with UUID4 primary keys
5. WHEN User permissions are checked THEN the Spatie Permission package SHALL work correctly with UUID4 keys
6. WHEN User sessions are managed THEN the session system SHALL reference users by UUID4

### Requirement 2

**User Story:** As a system administrator, I want the Family model to use UUID4 as its primary key, so that family identifiers are globally unique and can be safely shared across systems.

#### Acceptance Criteria

1. WHEN the Family model is accessed THEN the primary key SHALL be a UUID4 string
2. WHEN a new Family is created THEN the system SHALL automatically generate a UUID4 for the primary key
3. WHEN existing Family records are migrated THEN all data SHALL be preserved with new UUID4 primary keys
4. WHEN Users are associated with Families THEN the foreign key relationship SHALL use UUID4 references
5. WHEN Family data is exported or shared THEN UUID4 identifiers SHALL not reveal sequential information

### Requirement 3

**User Story:** As a system administrator, I want the TimelineItem model to use UUID4 as its primary key, so that timeline entries have globally unique identifiers suitable for distributed systems.

#### Acceptance Criteria

1. WHEN the TimelineItem model is accessed THEN the primary key SHALL be a UUID4 string
2. WHEN a new TimelineItem is created THEN the system SHALL automatically generate a UUID4 for the primary key
3. WHEN existing TimelineItem records are migrated THEN all data SHALL be preserved with new UUID4 primary keys
4. WHEN TimelineItems reference Users and Families THEN the foreign key relationships SHALL use UUID4 references
5. WHEN TimelineItems are linked to other items THEN the linked_items array SHALL contain UUID4 references

### Requirement 4

**User Story:** As a developer, I want all foreign key relationships to be updated to use UUID4 references, so that data integrity is maintained after the migration.

#### Acceptance Criteria

1. WHEN Users belong to Families THEN the users.family_id column SHALL store UUID4 values
2. WHEN TimelineItems belong to Users THEN the timeline_items.user_id column SHALL store UUID4 values
3. WHEN TimelineItems belong to Families THEN the timeline_items.family_id column SHALL store UUID4 values
4. WHEN permission relationships exist THEN model_has_permissions and model_has_roles tables SHALL reference UUID4 values
5. WHEN sessions reference users THEN the sessions.user_id column SHALL store UUID4 values

### Requirement 5

**User Story:** As a system administrator, I want the migration to be reversible and safe, so that the system can be rolled back if issues occur.

#### Acceptance Criteria

1. WHEN the migration is executed THEN existing data SHALL be backed up before changes
2. WHEN the migration encounters errors THEN the process SHALL be rolled back automatically
3. WHEN a rollback is needed THEN a reverse migration SHALL restore the original integer primary keys
4. WHEN the migration is tested THEN it SHALL work on both empty and populated databases
5. WHEN the migration runs THEN it SHALL complete within reasonable time limits for production data

### Requirement 6

**User Story:** As a developer, I want the Eloquent models to be updated to work seamlessly with UUID4 primary keys, so that existing application code continues to function.

#### Acceptance Criteria

1. WHEN models are defined THEN they SHALL specify UUID4 as the key type
2. WHEN models are created THEN UUID4 generation SHALL be automatic
3. WHEN relationships are accessed THEN they SHALL work transparently with UUID4 keys
4. WHEN model factories are used THEN they SHALL generate valid UUID4 primary keys
5. WHEN API responses include models THEN UUID4 keys SHALL be properly serialized

### Requirement 7

**User Story:** As a frontend developer, I want the API responses to include UUID4 identifiers, so that the client application can reference entities using the new key format.

#### Acceptance Criteria

1. WHEN API endpoints return User data THEN the id field SHALL contain a UUID4 string
2. WHEN API endpoints return Family data THEN the id field SHALL contain a UUID4 string
3. WHEN API endpoints return TimelineItem data THEN the id field SHALL contain a UUID4 string
4. WHEN API endpoints accept entity references THEN they SHALL accept UUID4 strings as identifiers
5. WHEN frontend code processes responses THEN UUID4 strings SHALL be handled correctly

### Requirement 8

**User Story:** As a database administrator, I want the database schema to be optimized for UUID4 primary keys, so that query performance remains acceptable.

#### Acceptance Criteria

1. WHEN UUID4 columns are created THEN they SHALL use appropriate database column types
2. WHEN indexes are created THEN they SHALL be optimized for UUID4 data types
3. WHEN foreign key constraints are created THEN they SHALL properly reference UUID4 columns
4. WHEN database queries are executed THEN performance SHALL be comparable to integer keys for typical operations
5. WHEN database storage is analyzed THEN the UUID4 implementation SHALL use reasonable storage space