import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => {
        // First try to resolve from guest folder for public pages
        const guestPages = ['welcome', 'about', 'services', 'help', 'contact', 'onboarding', 'whitepaper'];
        if (guestPages.includes(name)) {
            return resolvePageComponent(`./pages/guest/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        }
        // Otherwise resolve from the regular pages directory
        return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
