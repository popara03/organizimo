import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import Providers from '@/providers/providers';
import Nav from './components/custom/nav';
import Footer from './components/custom/footer';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title}` : appName,
    resolve: async (name) => {
        const page : any = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        );

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Providers>
                <Nav />
                <main className="min-h-[calc(100vh-100px)] py-8">
                    <App {...props} />
                </main>
                <Footer />
            </Providers>
        );
    },
    progress: {
        color: '#4B5563',
    },
});