<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DebugRoutes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:routes {--check-onboarding : Specifically check onboarding routes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug and test all application routes, with special focus on problematic routes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Route Debugging Tool');
        $this->line('========================');

        // Test core services
        $this->testCoreServices();

        // Test routes
        $this->testRoutes();

        // Specific onboarding check if requested
        if ($this->option('check-onboarding')) {
            $this->testOnboardingRoutes();
        }

        $this->line('');
        $this->info('✅ Route debugging complete!');
        $this->line('Access web endpoint at: /debug/routes');
    }

    private function testCoreServices()
    {
        $this->line('');
        $this->info('Testing Core Services:');

        // Database
        try {
            DB::connection()->getPdo();
            $this->line('  ✅ Database: Connected');
        } catch (\Exception $e) {
            $this->error('  ❌ Database: ' . $e->getMessage());
        }

        // Cache
        try {
            Cache::store()->put('test', 'value', 1);
            $testValue = Cache::store()->get('test');
            if ($testValue === 'value') {
                $this->line('  ✅ Cache: Working');
            } else {
                $this->line('  ⚠️  Cache: Test failed');
            }
        } catch (\Exception $e) {
            $this->error('  ❌ Cache: ' . $e->getMessage());
        }

        // Storage
        try {
            Storage::disk('local')->exists('.gitkeep') || Storage::disk('local')->put('.gitkeep', '');
            $this->line('  ✅ Storage: Working');
        } catch (\Exception $e) {
            $this->error('  ❌ Storage: ' . $e->getMessage());
        }
    }

    private function testRoutes()
    {
        $this->line('');
        $this->info('Testing Critical Routes:');

        $criticalRoutes = [
            '/' => 'GET',
            '/onboarding' => 'GET',
            '/debug/routes' => 'GET',
            '/api/onboarding/question' => 'GET',
            '/api/onboarding/answer' => 'POST',
        ];

        foreach ($criticalRoutes as $uri => $method) {
            $this->testRoute($uri, $method);
        }

        $totalRoutes = collect(Route::getRoutes())->count();
        $this->line("  📊 Total routes registered: {$totalRoutes}");
    }

    private function testRoute($uri, $method)
    {
        try {
            $matchedRoute = null;
            foreach (Route::getRoutes() as $route) {
                if ($route->matches(request()->create($uri, $method))) {
                    $matchedRoute = $route;
                    break;
                }
            }

            if ($matchedRoute) {
                $action = $matchedRoute->getActionName();
                $middleware = implode(', ', $matchedRoute->middleware());
                $this->line("  ✅ {$method} {$uri} → {$action}" . ($middleware ? " [{$middleware}]" : ''));
            } else {
                $this->error("  ❌ {$method} {$uri} → Route not found");
            }
        } catch (\Exception $e) {
            $this->error("  ❌ {$method} {$uri} → Error: " . $e->getMessage());
        }
    }

    private function testOnboardingRoutes()
    {
        $this->line('');
        $this->info('Testing Onboarding-Specific Routes:');

        // Test controller exists
        $controllerClass = 'App\\Http\\Controllers\\OnboardingController';
        if (class_exists($controllerClass)) {
            $this->line('  ✅ OnboardingController exists');

            $methods = get_class_methods($controllerClass);
            $this->line('  📋 Available methods: ' . implode(', ', $methods));

            if (in_array('getQuestion', $methods)) {
                $this->line('  ✅ getQuestion method exists');
            } else {
                $this->error('  ❌ getQuestion method missing');
            }
        } else {
            $this->error('  ❌ OnboardingController not found');
        }

        // Test environment variables
        $this->line('');
        $this->info('Environment Variables:');
        $envVars = [
            'APP_ENV',
            'APP_URL',
            'DB_CONNECTION',
            'VIZRA_API_KEY',
            'MISTRAL_API_KEY',
        ];

        foreach ($envVars as $var) {
            $value = env($var);
            if ($value) {
                $this->line("  ✅ {$var}: Set");
            } else {
                $this->line("  ⚠️  {$var}: Not set");
            }
        }
    }
}
