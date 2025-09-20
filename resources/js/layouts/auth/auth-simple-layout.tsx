import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Shield, Lock, Scale } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-10">
            {/* Discreet official status banner */}
            <div className="w-full max-w-xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg shadow-md mb-6">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="font-medium">Officiel Platform</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            <span>Sikker & Krypteret</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4" />
                            <span>Ministerie-godkendt</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <AppLogo className="h-20 w-20" />
                        {/* <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link> */}

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
