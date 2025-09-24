import { Link, usePage } from '@inertiajs/react';
import { LockOpen } from "lucide-react";
import AppLogo from '@/components/app-logo';
import { __ } from '@/lib/translations';
import { login } from '@/routes';

export default function GuestNav() {
    const { url } = usePage();

    const isActive = (href: string) => url === href;

    return (
        <nav className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-slate-200">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <AppLogo className="h-12 w-12" isCollapsed={false} />
            </Link>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center space-x-6 text-sm">
                    <Link href="/services" className={`font-medium transition-colors ${isActive('/services') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{__('welcome.header.services')}</Link>
                    <Link href="/help" className={`font-medium transition-colors ${isActive('/help') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{__('welcome.header.help')}</Link>
                    <Link href="/about" className={`font-medium transition-colors ${isActive('/about') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{__('welcome.header.about')}</Link>
                    <Link href="/contact" className={`font-medium transition-colors ${isActive('/contact') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{__('welcome.header.contact')}</Link>
                </div>
                <Link
                    href={login()}
                    className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
                >
                    <LockOpen className="h-4 w-4" />
                    {__('welcome.header.login')}
                </Link>
            </div>
        </nav>
    );
}
