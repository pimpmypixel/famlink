# Requirements Document

## Introduction

The Co-Parenting Timeline is a digital platform designed to facilitate communication and coordination between separated parents and social workers with the Danish Agen­cy of Fa­mily Law (DAFL). The system serves as a centralized hub where both parents and authorized consultants, mediators and social workers can document progress and consultations with the authorities. This platform aims to reduce conflict, improve transparency, and ensure consistent care for the child across both households. 

Key aspects and use cases include:
• Custody, residency and visitation
• Separation and divorce
• Guardianship

## Requirements

### Requirement 1

**User Story:** As a separated parent, I want to create and view timeline entries about correspondance with DAFL, so that all parties stay informed about case developments and can coordinate effectively.

#### Acceptance Criteria

1. WHEN a parent creates a new timeline entry THEN the system SHALL save the entry with author, timestamp, category, and content
2. WHEN a parent views the timeline THEN the system SHALL display all entries in chronological order with clear author identification
3. WHEN a parent categorizes an entry THEN the system SHALL accept categories of "parenting", "logistics", "consultation", or "other"
4. WHEN a parent adds tags to an entry THEN the system SHALL store and display these tags for filtering purposes
5. IF a parent creates an entry THEN the system SHALL automatically timestamp it with the current date and time UNLESS a custom timestamp is supplied

### Requirement 2

**User Story:** As a separated parent, I want to filter and search timeline entries, so that I can quickly find relevant information about specific topics or time periods.

#### Acceptance Criteria

1. WHEN a parent applies a category filter THEN the system SHALL display only entries matching that category
2. WHEN a parent applies a tag filter THEN the system SHALL display only entries containing those tags
3. WHEN a parent applies a date range filter THEN the system SHALL display only entries within that time period
4. WHEN a parent searches by text THEN the system SHALL display entries containing the search term in title or content
5. WHEN multiple filters are applied THEN the system SHALL display entries matching all active filters

### Requirement 3

**User Story:** As a DAFL employee (consultant), I want to add professional observations and recommendations to the timeline, so that both parents can access expert guidance and track progress.

#### Acceptance Criteria

1. WHEN a consultant creates an entry THEN the system SHALL clearly identify it as a professional consultation
2. WHEN a consultant adds recommendations THEN the system SHALL highlight these as actionable items
3. WHEN a consultant references previous entries THEN the system SHALL allow linking to related timeline items
4. IF a consultant creates an entry THEN the system SHALL notify both parents of the new consultation notes
5. WHEN parents view consultant entries THEN the system SHALL display the consultant's credentials and role

### Requirement 4

**User Story:** As a separated parent, I want to receive notifications about new timeline entries and important updates, so that I stay informed about my child's care and activities.

#### Acceptance Criteria

1. WHEN the other parent creates a new entry THEN the system SHALL send a notification to the receiving parent
2. WHEN a consultant adds new recommendations THEN the system SHALL notify both parents immediately
3. WHEN an entry is marked as urgent THEN the system SHALL send priority notifications
4. IF a parent hasn't viewed new entries within 24 hours THEN the system SHALL send a reminder notification
5. WHEN a parent receives notifications THEN the system SHALL allow them to customize notification preferences

### Requirement 5

**User Story:** As a separated parent, I want to attach documents and photos to timeline entries, so that I can provide complete context and evidence for important events or communications.

#### Acceptance Criteria

1. WHEN a parent creates an entry THEN the system SHALL allow attachment of photos, documents, and files
2. WHEN files are attached THEN the system SHALL validate file types and size limits
3. WHEN attachments are uploaded THEN the system SHALL store them securely and associate them with the entry
4. WHEN viewing entries with attachments THEN the system SHALL display thumbnails and allow full-size viewing
5. IF attachments contain sensitive information THEN the system SHALL ensure only authorized users can access them

### Requirement 6

**User Story:** As a separated parent, I want to export timeline data for legal or therapeutic purposes, so that I can provide comprehensive documentation when needed.

#### Acceptance Criteria

1. WHEN a parent requests an export THEN the system SHALL generate a PDF report of timeline entries
2. WHEN exporting data THEN the system SHALL include all entry details, timestamps, and attachments
3. WHEN generating reports THEN the system SHALL allow filtering by date range, category, or author
4. IF exporting for legal purposes THEN the system SHALL include digital signatures and timestamps for authenticity
5. WHEN an export is completed THEN the system SHALL provide a secure download link

### Requirement 7

**User Story:** As a system administrator, I want to manage user access and permissions, so that only authorized individuals can view and contribute to each family's timeline.

#### Acceptance Criteria

1. WHEN a new user is added THEN the system SHALL require proper authentication and role assignment
2. WHEN assigning roles THEN the system SHALL enforce permissions for "parent", "consultant", or "admin" roles
3. WHEN a consultant is added THEN the system SHALL require verification of professional credentials
4. IF unauthorized access is attempted THEN the system SHALL log the attempt and deny access
5. WHEN user permissions change THEN the system SHALL immediately update access rights

### Requirement 8

**User Story:** As a separated parent, I want to collaborate on shared calendar events and appointments, so that we can coordinate schedules and avoid conflicts.

#### Acceptance Criteria

1. WHEN a parent creates a calendar event THEN the system SHALL allow the other parent to view and respond
2. WHEN scheduling appointments THEN the system SHALL check for conflicts with existing events
3. WHEN events are updated THEN the system SHALL notify all relevant parties of changes
4. IF an event requires both parents' attendance THEN the system SHALL track confirmation status
5. WHEN viewing the calendar THEN the system SHALL display events with clear ownership and status indicators