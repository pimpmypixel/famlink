import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GuestNav from '@/components/guest-nav';
import GuestFooter from '@/components/guest-footer';
import { __ } from '@/lib/translations';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Shield, Lock } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <>
            <Head title="Log in">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 to-blue-50 p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-8 w-full max-w-7xl">
                    {/* Official Header Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 mb-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5" />
                                    <span className="text-sm font-semibold">{__('welcome.header.official_platform')}</span>
                                </div>
                                <div className="hidden md:flex items-center space-x-2 text-blue-100">
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">{__('welcome.header.governed_by_ministry')}</span>
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">{__('welcome.header.gdpr_compliant')}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-100">
                                <Lock className="h-4 w-4" />
                                <span className="text-xs font-medium">{__('welcome.header.secure_encrypted')}</span>
                            </div>
                        </div>
                    </div>

                    <GuestNav />
                </header>

                <div className="min-h-screen bg-background p-8 text-foreground w-full max-w-7xl">
                    {/* Security Information */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-4xl mx-auto">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">{__('auth.login.security_title')}</h3>
                        <p className="text-xs text-blue-700 mb-2">
                            {__('auth.login.security_description')}
                        </p>
                        <p className="text-xs text-blue-600">
                            <strong>Prototyping fase:</strong> Vi bruger traditionel login under udvikling. Når appen lanceres, vil MitID blive den primære autentificeringsmetode for maksimal sikkerhed.
                        </p>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start max-w-6xl mx-auto mb-4">
                        {/* Left column - Login Form */}
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">{__('auth.login.page_title')}</h2>
                                <p className="text-sm text-gray-600">{__('auth.login.description')}</p>
                            </div>

                            <Form action="/login" method="post" resetOnSuccess={['password']} className="flex flex-col gap-4">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4">
                                            <div className="grid gap-1">
                                                <Label htmlFor="email" className="text-sm font-medium">{__('auth.login.email_label')}</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    className="h-10 text-sm"
                                                    placeholder={__('auth.login.email_placeholder')}
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="grid gap-1">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password" className="text-sm font-medium">{__('auth.login.password_label')}</Label>
                                                    {canResetPassword && (
                                                        <TextLink href={request()} className="ml-auto text-xs text-blue-600 hover:text-blue-800" tabIndex={5}>
                                                            {__('auth.login.forgot_password')}
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    className="h-10 text-sm"
                                                    placeholder={__('auth.login.password_placeholder')}
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="remember" name="remember" tabIndex={3} className="h-4 w-4" />
                                                <Label htmlFor="remember" className="text-sm">{__('auth.login.remember_me')}</Label>
                                            </div>

                                            <Button type="submit" className="mt-2 h-10 text-sm font-medium" tabIndex={4} disabled={processing} data-test="login-button">
                                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                                {__('auth.login.login_button')}
                                            </Button>
                                        </div>

                                        <div className="text-center text-sm text-muted-foreground">
                                            {__('auth.login.no_account')} {' '}
                                            <TextLink href={register()} tabIndex={5} className="text-blue-600 hover:text-blue-800 font-medium">
                                                {__('auth.login.create_account')}
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>

                            {status && <div className="text-center text-sm font-medium text-green-600 bg-green-50 p-2 rounded">{status}</div>}
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden md:flex items-center justify-center">
                            <div className="h-64 w-px bg-gray-300"></div>
                        </div>

                        {/* Right column - MitID Image */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{__('auth.login.mitid_title')}</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {__('auth.login.mitid_description')}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <img
                                    src="/img/fake-mit-id-login.png"
                                    alt={__('auth.login.mitid_alt')}
                                    className="w-full h-auto max-w-sm"
                                />
                            </div>

                            <div className="text-center text-xs text-gray-500 max-w-xs">
                                {__('auth.login.mitid_footer')}
                            </div>
                        </div>
                    </div>

                    {/* Comprehensive Footer */}
                    <GuestFooter />
                </div>
            </div>
        </>
    );
}
