# Implementation Plan

- [x] 1. Install UUID dependencies and update models
  - Install ramsey/uuid package if not already available
  - Add HasUuids trait to User, Family, and TimelineItem models
  - Override newUniqueId() method to generate UUID4 instead of default UUIDv7
  - Update uniqueIds() method to specify which columns should receive UUIDs
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 6.1, 6.2_

- [ ] 2. Create comprehensive test suite for UUID models
  - Write unit tests for UUID generation in each model
  - Create tests for model relationships with UUID keys
  - Test model factories generate valid UUID4 primary keys
  - Write tests for CRUD operations with UUID primary keys
  - _Requirements: 6.3, 6.4, 6.5_

- [ ] 3. Create Phase 1 migration - Add UUID columns
  - Create migration to add uuid columns alongside existing integer primary keys
  - Add uuid columns: users.uuid, families.uuid, timeline_items.uuid
  - Generate UUID4 values for all existing records in the migration
  - Create temporary mapping tables to track old_id → new_uuid relationships
  - _Requirements: 5.1, 5.4_

- [ ] 4. Create Phase 2 migration - Add UUID foreign key columns
  - Add new UUID foreign key columns: users.family_uuid, timeline_items.user_uuid, timeline_items.family_uuid
  - Add sessions.user_uuid column for session management
  - Populate new UUID foreign key columns using mapping tables
  - Maintain existing integer foreign keys during transition
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 5. Create Phase 3 migration - Update permission system references
  - Update model_has_permissions table to handle UUID model_id values
  - Update model_has_roles table to handle UUID model_id values
  - Create data migration to convert existing permission/role assignments to UUID references
  - Test Spatie Permission functionality with UUID models
  - _Requirements: 4.4_

- [ ] 6. Create Phase 4 migration - Switch to UUID primary keys
  - Drop existing primary key constraints on id columns
  - Rename uuid columns to id and set as primary keys
  - Drop old integer id columns and associated sequences
  - Update all indexes to use new UUID primary key columns
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 7. Create Phase 5 migration - Update foreign key constraints
  - Drop old integer foreign key constraints
  - Rename UUID foreign key columns (remove _uuid suffix)
  - Create new foreign key constraints referencing UUID primary keys
  - Verify referential integrity after constraint updates
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 8.3_

- [ ] 8. Create rollback migration for emergency recovery
  - Create comprehensive rollback migration that reverses all UUID changes
  - Restore integer primary keys and foreign key relationships
  - Include data integrity checks in rollback process
  - Test rollback migration on development data
  - _Requirements: 5.2, 5.3_

- [ ] 9. Update model factories for testing
  - Modify UserFactory to work with UUID primary keys
  - Update any factory relationships to use UUID references
  - Ensure factories generate valid UUID4 values for testing
  - Test factory-generated models work correctly with relationships
  - _Requirements: 6.4, 6.5_

- [ ] 10. Update API controllers and resources
  - Modify TimelineController to handle UUID parameters
  - Update TimelineItemResource to serialize UUID fields correctly
  - Ensure all API endpoints accept UUID identifiers in requests
  - Test API responses include UUID identifiers in correct format
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 11. Update authentication and session handling
  - Verify Laravel Breeze authentication works with UUID User models
  - Test session management with UUID user references
  - Update any hardcoded user ID references in authentication code
  - Test password reset functionality with UUID user identifiers
  - _Requirements: 1.4, 1.6_

- [ ] 12. Update frontend TypeScript types and API calls
  - Update TypeScript interfaces to expect UUID strings for id fields
  - Modify API action files to handle UUID parameters
  - Update frontend components to work with UUID identifiers
  - Test frontend form submissions with UUID references
  - _Requirements: 7.5_

- [ ] 13. Create comprehensive integration tests
  - Write feature tests for complete user workflows with UUIDs
  - Test timeline item creation, editing, and deletion with UUID relationships
  - Test family management operations with UUID primary keys
  - Verify permission system works correctly with UUID models
  - _Requirements: 1.3, 2.3, 3.3, 4.4_

- [ ] 14. Update database seeders
  - Modify UserSeeder to work with UUID primary keys
  - Update FamilySeeder to generate UUID identifiers
  - Modify TimelineItemSeeder to use UUID foreign key references
  - Update RolesSeeder to work with UUID user models
  - _Requirements: 6.2, 6.4_

- [ ] 15. Performance testing and optimization
  - Benchmark query performance with UUID primary keys vs integers
  - Test join performance with UUID foreign key relationships
  - Verify database indexes are optimized for UUID columns
  - Monitor memory usage and query execution times
  - _Requirements: 8.4, 8.5_

- [ ] 16. Create migration execution script
  - Write artisan command to execute all migration phases safely
  - Include data integrity checks between each phase
  - Add rollback capability if any phase fails
  - Include progress reporting and logging
  - _Requirements: 5.1, 5.2, 5.5_

- [ ] 17. Update documentation and examples
  - Update API documentation to reflect UUID identifiers
  - Modify code examples to use UUID references
  - Update database schema documentation
  - Create migration guide for development team
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 18. Final integration testing and validation
  - Run complete test suite to verify all functionality works with UUIDs
  - Test application end-to-end with UUID models
  - Verify no performance regressions in critical user flows
  - Confirm all requirements are met and acceptance criteria satisfied
  - _Requirements: All requirements validation_