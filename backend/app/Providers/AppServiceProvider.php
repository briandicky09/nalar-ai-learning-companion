<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\Contracts\AIServiceInterface::class, function ($app) {
            $provider = config('services.ai.provider', 'mock');
            if ($provider === 'openclaw') {
                return $app->make(\App\Services\OpenClawService::class);
            }
            return $app->make(\App\Services\MockAIService::class);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
