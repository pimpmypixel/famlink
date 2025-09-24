// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { __ } from '@/lib/translations';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout title={__('verify_email_title')} description={__('verify_email_description')}>
            <Head title={__('email_verification_title')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {__('verification_link_sent')}
                </div>
            )}

            <Form {...EmailVerificationNotificationController.store.form} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {__('resend_verification_email')}
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm">
                            {__('logout')}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
