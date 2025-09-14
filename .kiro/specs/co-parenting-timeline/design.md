# Design Document

## Overview

The Co-Parenting Timeline system is built as a Laravel 12 application with React 19 and Inertia.js 2.0, providing a seamless single-page application experience. The system enables separated parents and authorized consultants to maintain a shared timeline of parenting activities, logistics coordination, and professional consultations.

The architecture follows Laravel's MVC pattern on the backend with a React-based frontend, leveraging Inertia.js for server-side rendering and seamless data flow between Laravel and React components.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Components] --> B[Inertia.js]
        B --> C[Timeline UI]
        B --> D[User Management]
        B --> E[File Upload]
    end
    
    subgraph "Backend Layer"
        F[Laravel Controllers] --> G[Services]
        G --> H[Repositories]
        H --> I[Eloquent Models]
        I --> J[SQLite Database]
    end
    
    subgraph "External Services"
        K[File Storage]
        L[Notification Service]
        M[Export Service]
    end
    
    B --> F
    G --> K
    G --> L
    G --> M
```

### Technology Stack

- **Backend**: Laravel 12.28.1 with PHP 8.4
- **Frontend**: React 19.1.1 with TypeScript
- **Bridge**: Inertia.js 2.0.6
- **Database**: SQLite (development), PostgreSQL (production recommended)
- **Styling**: Tailwind CSS 4.1.12
- **Testing**: Pest 4.1.0
- **Code Quality**: Laravel Pint 1.24.0, ESLint 9.33.0, Prettier 3.6.2
- **Package Manager**: Bun (replaces npm for all JavaScript package management)

## Components and Interfaces

### Backend Components

#### Models

**User Model (Enhanced)**
```php
class User extends Authenticatable
{
    protected $fillable = [
        'name', 'email', 'password', 'role', 'family_id', 
        'professional_credentials', 'notification_preferences'
    ];
    
    protected $casts = [
        'notification_preferences' => 'array',
        'professional_credentials' => 'array'
    ];
    
    public function family(): BelongsTo;
    public function timelineItems(): HasMany;
    public function notifications(): HasMany;
}
```

**Family Model**
```php
class Family extends Model
{
    protected $fillable = ['name', 'child_name', 'created_by'];
    
    public function users(): HasMany;
    public function timelineItems(): HasMany;
    public function calendarEvents(): HasMany;
}
```

**TimelineItem Model**
```php
class TimelineItem extends Model
{
    protected $fillable = [
        'family_id', 'user_id', 'title', 'content', 'category',
        'tags', 'is_urgent', 'attachments', 'linked_items'
    ];
    
    protected $casts = [
        'tags' => 'array',
        'attachments' => 'array',
        'linked_items' => 'array',
        'is_urgent' => 'boolean'
    ];
    
    public function user(): BelongsTo;
    public function family(): BelongsTo;
    public function comments(): HasMany;
}
```

**CalendarEvent Model**
```php
class CalendarEvent extends Model
{
    protected $fillable = [
        'family_id', 'created_by', 'title', 'description',
        'start_date', 'end_date', 'location', 'attendees', 'status'
    ];
    
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'attendees' => 'array'
    ];
}
```

#### Controllers

**TimelineController**
- `index()`: Return Inertia response with timeline data and filters
- `store()`: Create new timeline item and redirect with Inertia
- `update()`: Update existing item and return Inertia response
- `destroy()`: Delete item and redirect with Inertia
- `export()`: Generate PDF export and return file download

**CalendarController**
- `index()`: Return Inertia response with calendar events
- `store()`: Create new event and redirect with Inertia
- `update()`: Update event and return Inertia response
- `respond()`: Respond to event invitation with Inertia redirect

**NotificationController**
- `index()`: Return Inertia response with user notifications
- `markAsRead()`: Mark notifications as read via Inertia form
- `updatePreferences()`: Update notification settings with Inertia redirect

#### Services

**TimelineService**
```php
class TimelineService
{
    public function createItem(array $data, User $user): TimelineItem;
    public function getFilteredItems(Family $family, array $filters): Collection;
    public function exportTimeline(Family $family, array $filters): string;
    public function linkItems(TimelineItem $item, array $linkedIds): void;
}
```

**NotificationService**
```php
class NotificationService
{
    public function notifyNewItem(TimelineItem $item): void;
    public function notifyUrgentItem(TimelineItem $item): void;
    public function sendReminders(): void;
}
```

**FileService**
```php
class FileService
{
    public function uploadAttachment(UploadedFile $file, TimelineItem $item): array;
    public function deleteAttachment(string $path): bool;
    public function generateThumbnail(string $path): string;
}
```

### Frontend Components

#### Core Components

**Timeline Component (Enhanced)**
```typescript
interface TimelineProps {
  items: TimelineItem[];
  currentUser: User;
  filters: TimelineFilters;
  onFilterChange: (filters: TimelineFilters) => void;
  onItemUpdate: (item: TimelineItem) => void;
}

const Timeline: React.FC<TimelineProps> = ({ ... }) => {
  // Enhanced timeline with filtering, search, and real-time updates
};
```

**TimelineItem Component (Enhanced)**
```typescript
interface TimelineItemProps {
  item: TimelineItem;
  currentUser: User;
  onUpdate: (item: TimelineItem) => void;
  onDelete: (id: string) => void;
  onLink: (linkedItems: string[]) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ ... }) => {
  // Enhanced item with attachments, linking, and comments
};
```

**FilterPanel Component**
```typescript
interface FilterPanelProps {
  filters: TimelineFilters;
  onFilterChange: (filters: TimelineFilters) => void;
  categories: string[];
  tags: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ ... }) => {
  // Advanced filtering with date ranges, categories, tags, and search
};
```

**AttachmentUpload Component**
```typescript
interface AttachmentUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles: number;
  acceptedTypes: string[];
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({ ... }) => {
  // Drag-and-drop file upload with preview and validation
};
```

**CalendarView Component**
```typescript
interface CalendarViewProps {
  events: CalendarEvent[];
  onEventCreate: (event: Partial<CalendarEvent>) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  currentUser: User;
}

const CalendarView: React.FC<CalendarViewProps> = ({ ... }) => {
  // Shared calendar with event management
};
```

#### Layout Components

**AppLayout (Enhanced)**
- Navigation with timeline/calendar toggle
- User role indicator
- Notification badge
- Family context switcher (for consultants)

**TimelineLayout**
- Sidebar with filters
- Main timeline area
- Quick action buttons
- Export options

## Data Models

### Database Schema

```sql
-- Enhanced Users table
ALTER TABLE users ADD COLUMN role ENUM('parent', 'consultant', 'admin') DEFAULT 'parent';
ALTER TABLE users ADD COLUMN family_id INTEGER;
ALTER TABLE users ADD COLUMN professional_credentials JSON;
ALTER TABLE users ADD COLUMN notification_preferences JSON;

-- Families table
CREATE TABLE families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    child_name VARCHAR(255) NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Timeline Items table
CREATE TABLE timeline_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('parenting', 'logistics', 'consultation', 'other') NOT NULL,
    tags JSON,
    is_urgent BOOLEAN DEFAULT FALSE,
    attachments JSON,
    linked_items JSON,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Calendar Events table
CREATE TABLE calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    location VARCHAR(255),
    attendees JSON,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (family_id) REFERENCES families(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    read_at DATETIME,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timeline_item_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (timeline_item_id) REFERENCES timeline_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### TypeScript Interfaces

```typescript
interface TimelineItem {
  id: string;
  family_id: string;
  user_id: string;
  author: 'father' | 'mother' | 'consultant';
  title: string;
  content: string;
  date: string;
  timestamp: number;
  category: 'parenting' | 'logistics' | 'consultation' | 'other';
  tags: string[];
  is_urgent: boolean;
  attachments: Attachment[];
  linked_items: string[];
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

interface Attachment {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
}

interface CalendarEvent {
  id: string;
  family_id: string;
  created_by: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  attendees: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface TimelineFilters {
  category?: string;
  tags?: string[];
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  urgent_only?: boolean;
}

interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  urgent_only: boolean;
  digest_frequency: 'immediate' | 'daily' | 'weekly';
}
```

## Error Handling

### Backend Error Handling

**Custom Exception Classes**
```php
class TimelineException extends Exception {}
class UnauthorizedFamilyAccess extends TimelineException {}
class InvalidFileUpload extends TimelineException {}
class ExportGenerationFailed extends TimelineException {}
```

**Global Exception Handler**
```php
class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof TimelineException) {
            return Inertia::render('Error', [
                'status' => 422,
                'message' => $exception->getMessage()
            ]);
        }
        
        return parent::render($request, $exception);
    }
}
```

### Frontend Error Handling

**Error Boundary Component**
```typescript
class TimelineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

**API Error Handling**
```typescript
const useTimelineApi = () => {
  const handleApiError = (error: any) => {
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 422) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  };
  
  return { handleApiError };
};
```

## Testing Strategy

### Backend Testing

**Feature Tests**
```php
class TimelineTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_parent_can_create_timeline_item()
    {
        $user = User::factory()->parent()->create();
        $family = Family::factory()->create();
        $user->family()->associate($family);
        
        $response = $this->actingAs($user)
            ->post('/timeline', [
                'title' => 'Soccer Practice',
                'content' => 'Emma has practice today',
                'category' => 'logistics'
            ]);
            
        $response->assertRedirect();
        $this->assertDatabaseHas('timeline_items', [
            'title' => 'Soccer Practice',
            'user_id' => $user->id
        ]);
    }
    
    public function test_consultant_can_view_family_timeline()
    {
        // Test consultant access permissions
    }
    
    public function test_timeline_export_generates_pdf()
    {
        // Test PDF export functionality
    }
}
```

**Unit Tests**
```php
class TimelineServiceTest extends TestCase
{
    public function test_creates_timeline_item_with_attachments()
    {
        $service = new TimelineService();
        $user = User::factory()->create();
        
        $item = $service->createItem([
            'title' => 'Test Item',
            'content' => 'Test content',
            'category' => 'parenting'
        ], $user);
        
        $this->assertInstanceOf(TimelineItem::class, $item);
    }
}
```

### Frontend Testing

**Component Tests**
```typescript
describe('Timeline Component', () => {
  it('renders timeline items correctly', () => {
    const mockItems = [
      {
        id: '1',
        title: 'Test Item',
        content: 'Test content',
        author: 'father',
        category: 'parenting'
      }
    ];
    
    render(<Timeline items={mockItems} currentUser={mockUser} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
  
  it('filters items by category', () => {
    // Test filtering functionality
  });
  
  it('handles file uploads correctly', () => {
    // Test file upload component
  });
});
```

**Integration Tests**
```typescript
describe('Timeline Integration', () => {
  it('creates new timeline item and updates list', async () => {
    // Test full create flow
  });
  
  it('exports timeline data as PDF', async () => {
    // Test export functionality
  });
});
```

### API Testing

**Pest API Tests**
```php
it('returns paginated timeline items', function () {
    $user = User::factory()->parent()->create();
    $family = Family::factory()->create();
    TimelineItem::factory()->count(15)->create(['family_id' => $family->id]);
    
    $response = $this->actingAs($user)
        ->get('/api/timeline?page=1&per_page=10');
        
    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'title', 'content', 'author', 'created_at']
            ],
            'meta' => ['current_page', 'total', 'per_page']
        ]);
});

it('validates timeline item creation', function () {
    $user = User::factory()->parent()->create();
    
    $response = $this->actingAs($user)
        ->post('/api/timeline', []);
        
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'content', 'category']);
});
```

This design provides a comprehensive foundation for building a robust co-parenting timeline application that addresses all the requirements while leveraging the existing Laravel and React infrastructure.