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