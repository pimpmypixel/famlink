# Famlink Development Workflow Instructions

## Starting a New Development Session

1. **Check Application State**
   ```bash
   # Use MCP tool to get current application information
   application-info
   ```

2. **Review Current Database Schema**
   ```bash
   # Check existing tables and relationships
   database-schema
   ```

3. **Check Recent Logs**
   ```bash
   # Review any recent errors or issues
   read-log-entries
   ```

4. **Verify Routes**
   ```bash
   # Understand current routing structure
   list-routes
   ```

## Implementing New Features

### Backend Development
1. **Create Migration** (if database changes needed)
   ```bash
   php artisan make:migration create_table_name
   ```

2. **Update Model** (if new relationships or fields)
   ```php
   // Add relationships and casts as needed
   public function family(): BelongsTo
   {
       return $this->belongsTo(Family::class);
   }
   ```

3. **Create/Update Controller**
   ```php
   // Use Inertia.js responses for SPA-like experience
   public function index()
   {
       return Inertia::render('Timeline/Index', [
           'items' => TimelineItem::with('user')->get()
       ]);
   }
   ```

4. **Add Routes**
   ```php
   // routes/web.php
   Route::resource('timeline', TimelineController::class);
   ```

5. **Create Form Request** (for validation)
   ```bash
   php artisan make:request StoreTimelineItemRequest
   ```

### Frontend Development
1. **Create React Component**
   ```typescript
   // resources/js/components/TimelineItem.tsx
   interface Props {
       item: TimelineItem;
       currentUser: User;
   }

   export default function TimelineItem({ item, currentUser }: Props) {
       return (
           <div className="timeline-item">
               {/* Component implementation */}
           </div>
       );
   }
   ```

2. **Update Inertia.js Page**
   ```typescript
   // resources/js/pages/Timeline/Index.tsx
   export default function Index({ items, currentUser }: PageProps) {
       return (
           <AppLayout>
               <Timeline items={items} currentUser={currentUser} />
           </AppLayout>
       );
   }
   ```

3. **Add Routes** (Laravel side)
   ```php
   // routes/web.php
   Route::inertia('/timeline', 'Timeline/Index');
   ```

## Testing New Features

### Backend Testing
1. **Create Feature Test**
   ```bash
   php artisan make:test TimelineTest --feature
   ```

2. **Write Test Cases**
   ```php
   it('allows parent to create timeline item', function () {
       $user = User::factory()->create();
       $family = Family::factory()->create();

       $response = $this->actingAs($user)
           ->post('/timeline', [
               'title' => 'Test Item',
               'content' => 'Test content',
               'family_id' => $family->id
           ]);

       $response->assertRedirect();
       $this->assertDatabaseHas('timeline_items', [
           'title' => 'Test Item'
       ]);
   });
   ```

3. **Run Tests**
   ```bash
   composer test
   # or specific test
   php artisan test --filter=TimelineTest
   ```

### Frontend Testing
1. **Component Testing** (if implemented)
2. **Integration Testing** with Inertia.js
3. **Browser Testing** using MCP tools

### Pest v4 Browser Testing

Famlink uses Pest v4 for comprehensive browser testing, providing powerful tools for testing React components, Inertia.js pages, and user interactions.

#### Setting Up Browser Tests
1. **Create Browser Test**
   ```bash
   php artisan make:test SpeedDialTest --browser
   ```

2. **Basic Browser Test Structure**
   ```php
   <?php

   use Illuminate\Foundation\Testing\RefreshDatabase;
   use Spatie\Permission\Models\Role;

   uses(RefreshDatabase::class);

   use function Pest\Laravel\actingAs;

   it('can interact with speed dial component', function () {
       // Seed required roles
       Role::firstOrCreate(['name' => 'far']);

       $user = \App\Models\User::factory()->create([
           'email' => 'test@famlink.test',
           'name' => 'Test User'
       ]);
       $user->assignRole('far');

       actingAs($user);

       $page = visit('/dashboard');

       // Test SpeedDial functionality
       $page->assertPresent('button[aria-label="Open speed dial"]')
           ->click('button[aria-label="Open speed dial"]')
           ->assertPresent('button[aria-label="Ask AI"]');
   });
   ```

#### Browser Testing Best Practices

**Role-Based Authentication:**
```php
// Always seed required roles for authenticated tests
Role::firstOrCreate(['name' => 'far']); // Parent role
Role::firstOrCreate(['name' => 'mor']); // Parent role
Role::firstOrCreate(['name' => 'myndighed']); // Authority role

$user = User::factory()->create();
$user->assignRole('far'); // Assign appropriate role
actingAs($user);
```

**Component Selectors:**
```php
// Use aria-labels for accessibility-compliant selectors
$page->assertPresent('button[aria-label="Open speed dial"]');
$page->assertPresent('button[aria-label="Ask AI"]');

// Avoid brittle CSS selectors - prefer semantic attributes
// ❌ Bad: $page->assertPresent('.speed-dial-button');
// ✅ Good: $page->assertPresent('button[aria-label="Open speed dial"]');
```

**Modal Testing Considerations:**
```php
// Modal interactions may cause stream errors in browser tests
// Focus on component visibility and interaction rather than full modal flow
$page->click('button[aria-label="Open speed dial"]')
    ->assertPresent('button[aria-label="Ask AI"]');

// For full modal testing, consider API mocking or separate integration tests
// Note: ->wait() calls can cause "Expected a valid stream" errors
```

**Testing SpeedDial Components:**
```php
it('speed dial opens and shows actions', function () {
    // Setup user with required role
    Role::firstOrCreate(['name' => 'far']);
    $user = User::factory()->create();
    $user->assignRole('far');
    actingAs($user);

    $page = visit('/dashboard');

    // Test trigger button exists
    $page->assertPresent('button[aria-label="Open speed dial"]')

        // Click to open menu
        ->click('button[aria-label="Open speed dial"]')

        // Verify action buttons appear
        ->assertPresent('button[aria-label="Ask AI"]');
});
```

**Testing Chat Modal Components:**
```php
it('chat modal accessibility features work', function () {
    Role::firstOrCreate(['name' => 'far']);
    $user = User::factory()->create();
    $user->assignRole('far');
    actingAs($user);

    $page = visit('/dashboard');

    // Test SpeedDial opens (modal testing limited due to API calls)
    $page->assertPresent('button[aria-label="Open speed dial"]')
        ->click('button[aria-label="Open speed dial"]')
        ->assertPresent('button[aria-label="Ask AI"]');

    // Note: Full modal interaction testing requires API mocking
    // to avoid "Expected a valid stream" errors from fetch requests
});
```

#### Running Browser Tests
```bash
# Run all browser tests
composer test --filter=Browser

# Run specific browser test
composer test --filter=ApprovedUserChatTest

# Run with verbose output
composer test --filter=SpeedDialTest -v
```

#### Browser Test Troubleshooting

**"Expected a valid stream" Errors:**
- Caused by `->wait()` calls triggering API requests in browser test environment
- Solution: Remove `->wait()` calls or mock API endpoints
- Focus tests on component visibility rather than async operations

**Role Authentication Issues:**
- Ensure roles are seeded: `Role::firstOrCreate(['name' => 'far'])`
- Assign roles to test users: `$user->assignRole('far')`
- Use `actingAs($user)` for authentication

**Component Not Found:**
- Verify aria-labels match actual component implementation
- Check that components render in the correct layout (AppSidebarLayout)
- Use browser snapshots to debug: `browser_snapshot`

**Modal API Calls:**
- Modal components making fetch requests cause stream errors
- Skip API calls in test environment or mock responses
- Test component visibility and interaction separately

#### Browser Testing Examples

**Complete SpeedDial Test:**
```php
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

it('speed dial component works correctly', function () {
    // Setup
    Role::firstOrCreate(['name' => 'far']);
    $user = User::factory()->create();
    $user->assignRole('far');
    actingAs($user);

    $page = visit('/dashboard');

    // Test trigger button
    $page->assertPresent('button[aria-label="Open speed dial"]')

        // Open speed dial menu
        ->click('button[aria-label="Open speed dial"]')

        // Verify actions are visible
        ->assertPresent('button[aria-label="Ask AI"]')

        // Test can click action (without triggering modal)
        ->click('button[aria-label="Ask AI"]')

        // Verify speed dial is still accessible
        ->assertPresent('button[aria-label="Open speed dial"]');
});
```

**Onboarding Chat Test:**
```php
it('onboarding chat flow works', function () {
    $page = visit('/onboarding');

    // Test initial state
    $page->assertSee('Welcome to Famlink')

        // Navigate through onboarding steps
        ->click('button[aria-label="Continue"]')
        ->assertSee('Tell us about yourself')

        // Complete onboarding
        ->fill('input[name="name"]', 'Test User')
        ->click('button[type="submit"]')

        // Verify completion
        ->assertSee('Onboarding complete');
});
```

## Code Quality Checks

### Before Committing
1. **PHP Code Formatting**
   ```bash
   ./vendor/bin/pint
   ```

2. **Frontend Code Quality**
   ```bash
   bun run format
   bun run lint
   bun run types
   ```

3. **Run Tests**
   ```bash
   composer test
   ```

4. **Check for Errors**
   ```bash
   # Use MCP tools to verify
   read-log-entries
   browser_get_console_logs
   ```

## Debugging Issues

### Backend Issues
1. **Check Logs**
   ```bash
   read-log-entries
   ```

2. **Use Tinker**
   ```php
   // Test code in Laravel context
   User::first()
   ```

3. **Database Queries**
   ```sql
   -- Use MCP database-query tool
   SELECT * FROM users LIMIT 5;
   ```

### Frontend Issues
1. **Browser Console**
   ```bash
   browser_get_console_logs
   ```

2. **Network Requests**
   ```bash
   browser_snapshot
   ```

3. **Component State**
   - Check React DevTools
   - Verify Inertia.js data flow

## Database Operations

### Schema Changes
1. **Create Migration**
   ```bash
   php artisan make:migration add_attachments_to_timeline_items
   ```

2. **Run Migration**
   ```bash
   php artisan migrate
   ```

3. **Check Schema**
   ```bash
   database-schema
   ```

### Data Seeding
1. **Create Seeder**
   ```bash
   php artisan make:seeder FamilySeeder
   ```

2. **Run Seeders**
   ```bash
   php artisan db:seed
   ```

## File Upload Handling

### Backend Implementation
1. **Create File Service**
   ```php
   class FileService
   {
       public function uploadAttachment(UploadedFile $file): array
       {
           // Handle file upload and return metadata
       }
   }
   ```

2. **Update Controller**
   ```php
   public function store(Request $request)
   {
       $file = $request->file('attachment');
       $attachment = app(FileService::class)->uploadAttachment($file);

       // Save attachment data to model
   }
   ```

### Frontend Implementation
1. **File Input Component**
   ```typescript
   const [files, setFiles] = useState<File[]>([]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setFiles(Array.from(e.target.files || []));
   };
   ```

2. **Inertia.js Form Submission**
   ```typescript
   const form = useForm({
       title: '',
       content: '',
       attachments: []
   });

   const submit = () => {
       form.post('/timeline', {
           onSuccess: () => form.reset()
       });
   };
   ```

## Performance Optimization

### Backend Optimization
1. **Eager Loading**
   ```php
   $items = TimelineItem::with('user', 'family')->get();
   ```

2. **Database Indexing**
   - Add indexes for frequently queried columns
   - Use composite indexes for complex queries

3. **Caching**
   ```php
   Cache::remember('timeline_items', 3600, function () {
       return TimelineItem::all();
   });
   ```

### Frontend Optimization
1. **Component Memoization**
   ```typescript
   const TimelineItem = memo(function TimelineItem({ item }) {
       // Component implementation
   });
   ```

2. **Lazy Loading**
   ```typescript
   const LazyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. **Bundle Splitting**
   - Use dynamic imports for large components
   - Optimize Vite build configuration

## Security Best Practices

### Authentication & Authorization
1. **Use Policies**
   ```php
   class TimelineItemPolicy
   {
       public function view(User $user, TimelineItem $item)
       {
           return $user->family_id === $item->family_id;
       }
   }
   ```

2. **Middleware**
   ```php
   Route::middleware(['auth', 'can:view,timelineItem'])->group(function () {
       // Protected routes
   });
   ```

### Data Validation
1. **Form Requests**
   ```php
   class StoreTimelineItemRequest extends FormRequest
   {
       public function rules(): array
       {
           return [
               'title' => 'required|string|max:255',
               'content' => 'required|string',
               'category' => 'required|in:parenting,logistics,consultation,other'
           ];
       }
   }
   ```

2. **File Validation**
   ```php
   'attachment' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
   ```

## Deployment Preparation

### Pre-deployment Checklist
1. **Environment Configuration**
   - Verify production environment variables
   - Check database connection settings
   - Confirm file storage configuration

2. **Code Quality**
   - Run all tests: `composer test`
   - Check code formatting: `./vendor/bin/pint --test`
   - Verify TypeScript: `bun run types`

3. **Performance**
   - Run optimization commands: `php artisan optimize`
   - Clear caches: `php artisan optimize:clear`
   - Verify asset compilation: `bun run build`

4. **Security**
   - Remove debug statements
   - Verify authentication flows
   - Check file permissions

### Production Commands
```bash
# Build assets
bun run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan optimize
```
