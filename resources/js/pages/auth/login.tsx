import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout /* title="Log in to your account" description="Enter your email and password below to log in" */>
            <Head title="Log in" />

            {/* Security Information */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">{__('auth.login.security_title')}</h3>
                <p className="text-xs text-blue-700 mb-2">
                    {__('auth.login.security_description')}<
                </p>
                <p className="text-xs text-blue-600">
                    <strong>Prototyping fase:</strong> Vi bruger traditionel login under udvikling. Når appen lanceres, vil MitID blive den primære autentificeringsmetode for maksimal sikkerhed.
                </p>
            </div>

            {/* Two-column layout */}
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
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
                                                    {__('auth.login.forgot_password')}<
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
                                    {__('auth.login.no_account')}<{' '}
                                    <TextLink href={register()} tabIndex={5} className="text-blue-600 hover:text-blue-800 font-medium">
                                        {__('auth.login.create_account')}<
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
                            {__('auth.login.mitid_description')}<
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <img
                            src="/img/fake-mit-id-login.png"
                            alt={__('auth.login.mitid_alt')}<
                            className="w-full h-auto max-w-sm"
                        />
                    </div>

                    <div className="text-center text-xs text-gray-500 max-w-xs">
                        {__('auth.login.mitid_footer')}<
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
