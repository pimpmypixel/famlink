<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class RouteTestController extends Controller
{
    public function testAllRoutes(Request $request)
    {
        $results = [];
        $errors = [];

        // Test database connection
        try {
            DB::connection()->getPdo();
            $results['database'] = '✅ Connected';
        } catch (\Exception $e) {
            $errors['database'] = '❌ Database connection failed: ' . $e->getMessage();
        }

        // Test cache
        try {
            Cache::store()->put('test', 'value', 1);
            $testValue = Cache::store()->get('test');
            if ($testValue === 'value') {
                $results['cache'] = '✅ Connected and working';
            } else {
                $results['cache'] = '❌ Cache test failed';
            }
        } catch (\Exception $e) {
            $errors['cache'] = '❌ Cache connection failed: ' . $e->getMessage();
        }

        // Test storage
        try {
            Storage::disk('local')->exists('.gitkeep') || Storage::disk('local')->put('.gitkeep', '');
            $results['storage'] = '✅ Connected';
        } catch (\Exception $e) {
            $errors['storage'] = '❌ Storage connection failed: ' . $e->getMessage();
        }

        // Get all routes
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
                'action' => $route->getActionName(),
                'middleware' => $route->middleware(),
            ];
        });

        // Test specific problematic routes
        $testRoutes = [
            '/api/onboarding/question' => 'GET',
            '/api/onboarding/answer' => 'POST',
            '/api/onboarding/stream/test-session' => 'GET',
            '/' => 'GET',
            '/onboarding' => 'GET',
        ];

        $routeTests = [];
        foreach ($testRoutes as $uri => $method) {
            try {
                $route = Route::getRoutes()->getByName(null); // Get route by URI
                $matchedRoute = null;

                foreach (Route::getRoutes() as $route) {
                    if ($route->matches(request()->create($uri, $method))) {
                        $matchedRoute = $route;
                        break;
                    }
                }

                if ($matchedRoute) {
                    $routeTests[$uri] = [
                        'status' => '✅ Found',
                        'method' => $method,
                        'action' => $matchedRoute->getActionName(),
                        'middleware' => $matchedRoute->middleware(),
                    ];
                } else {
                    $routeTests[$uri] = [
                        'status' => '❌ Not found',
                        'method' => $method,
                    ];
                }
            } catch (\Exception $e) {
                $routeTests[$uri] = [
                    'status' => '❌ Error: ' . $e->getMessage(),
                    'method' => $method,
                ];
            }
        }

        // Test environment variables
        $envChecks = [
            'APP_ENV' => env('APP_ENV', 'not set'),
            'APP_URL' => env('APP_URL', 'not set'),
            'DB_CONNECTION' => env('DB_CONNECTION', 'not set'),
            'CACHE_DRIVER' => env('CACHE_DRIVER', 'not set'),
            'SESSION_DRIVER' => env('SESSION_DRIVER', 'not set'),
            'QUEUE_CONNECTION' => env('QUEUE_CONNECTION', 'not set'),
            'VIZRA_API_KEY' => env('VIZRA_API_KEY') ? 'Set' : 'Not set',
            'MISTRAL_API_KEY' => env('MISTRAL_API_KEY') ? 'Set' : 'Not set',
        ];

        // Test onboarding controller specifically
        $onboardingTest = $this->testOnboardingController();

        return response()->json([
            'timestamp' => now()->toISOString(),
            'environment' => app()->environment(),
            'laravel_version' => app()->version(),
            'php_version' => PHP_VERSION,
            'results' => $results,
            'errors' => $errors,
            'route_tests' => $routeTests,
            'onboarding_test' => $onboardingTest,
            'environment_variables' => $envChecks,
            'all_routes_count' => $routes->count(),
            'routes_sample' => $routes->take(10)->values(),
        ]);
    }

    private function testOnboardingController()
    {
        try {
            $controller = app(OnboardingController::class);

            // Test if controller exists and is callable
            if (!method_exists($controller, 'getQuestion')) {
                return ['status' => '❌ getQuestion method not found'];
            }

            // Test basic instantiation
            return [
                'status' => '✅ Controller loaded successfully',
                'methods' => get_class_methods(OnboardingController::class),
            ];
        } catch (\Exception $e) {
            return [
                'status' => '❌ Controller test failed: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ];
        }
    }

    public function testSpecificRoute(Request $request, $method, $path)
    {
        try {
            // URL decode the path
            $uri = urldecode($path);

            // Create a test request
            $testRequest = Request::create($uri, $method);

            // Find matching route
            $route = null;
            foreach (Route::getRoutes() as $r) {
                if ($r->matches($testRequest)) {
                    $route = $r;
                    break;
                }
            }

            if (!$route) {
                return response()->json([
                    'error' => 'Route not found',
                    'method' => $method,
                    'uri' => $uri,
                ], 404);
            }

            // Test route resolution
            $result = [
                'method' => $method,
                'uri' => $uri,
                'route_found' => true,
                'action' => $route->getActionName(),
                'middleware' => $route->middleware(),
                'parameters' => $route->parameters(),
            ];

            // Try to resolve controller
            try {
                $action = $route->getAction();
                if (isset($action['controller'])) {
                    list($controller, $methodName) = explode('@', $action['controller']);
                    $result['controller'] = $controller;
                    $result['controller_method'] = $methodName;

                    // Check if controller exists
                    if (class_exists($controller)) {
                        $result['controller_exists'] = true;
                        $result['controller_methods'] = get_class_methods($controller);
                    } else {
                        $result['controller_exists'] = false;
                    }
                }
            } catch (\Exception $e) {
                $result['controller_resolution_error'] = $e->getMessage();
            }

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Route test failed',
                'message' => $e->getMessage(),
                'method' => $method,
                'uri' => isset($uri) ? $uri : $path,
            ], 500);
        }
    }
}
