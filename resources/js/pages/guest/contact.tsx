import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Lock, Sparkles, Shield, Scale, Phone, Mail, MapPin } from "lucide-react";
import GuestNav from '@/components/guest-nav';
import GuestFooter from '@/components/guest-footer';
import { __ } from '@/lib/translations';

export default function Contact() {
    return (
        <>
            <Head title={__('welcome.header.contact')}>
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

                <div className="min-h-screen bg-background p-8 text-foreground max-w-6xl mx-auto">
                    {/* Trust Indicators */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
                            <div className="text-center mb-4">
                                <span className="text-lg font-bold tracking-wide text-blue-700">{__('welcome.trust_indicators.your_voice_your_strength')}</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <span className="font-medium">{__('welcome.trust_indicators.officially_approved')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">{__('welcome.trust_indicators.encrypted_communication')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-purple-600" />
                                    <span className="font-medium">{__('welcome.trust_indicators.gdpr_compliant')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-orange-600" />
                                    <span className="font-medium">{__('welcome.trust_indicators.ai_supported_advice')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Hero */}
                    <section className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white py-24 px-8 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10">
                                <Shield className="h-32 w-32 text-blue-300" />
                            </div>
                            <div className="absolute bottom-10 right-10">
                                <Scale className="h-24 w-24 text-blue-400" />
                            </div>
                        </div>

                        <div className="max-w-5xl mx-auto text-center relative z-10">
                            <div className="mb-6">
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <span className="text-lg font-bold tracking-wide text-blue-200">{__('welcome.hero.tagline')}</span>
                                    <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                                        <Shield className="h-4 w-4" />
                                        {__('welcome.hero.official_platform_family_law')}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Kontakt Os
                            </h1>

                            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Vi er her for at hjælpe. Kontakt Familie Link support for assistance med din sag
                                eller spørgsmål om vores tjenester.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href="tel:70200000"
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Phone className="h-5 w-5" />
                                    Ring Nu: 70 20 00 00
                                </Link>
                                <Link
                                    href="mailto:support@familielink.dk"
                                    className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-200"
                                >
                                    <Mail className="h-5 w-5" />
                                    Send Email
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="max-w-6xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Kontaktinformation</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Flere måder at få fat i os på - vælg den der passer bedst til dine behov
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                    <Phone className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-slate-800">Telefon Support</h3>
                                <div className="space-y-2 text-slate-600">
                                    <p className="font-semibold">70 20 00 00</p>
                                    <p className="text-sm">Man-Fre: 8:00 - 16:00</p>
                                    <p className="text-sm">Lørdag: 9:00 - 13:00</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                    <Mail className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-slate-800">Email Support</h3>
                                <div className="space-y-2 text-slate-600">
                                    <p className="font-semibold">support@familielink.dk</p>
                                    <p className="text-sm">Svar indenfor 24 timer</p>
                                    <p className="text-sm">Sikker krypteret kommunikation</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                                    <MapPin className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-slate-800">Besøgsadresse</h3>
                                <div className="space-y-2 text-slate-600">
                                    <p className="font-semibold">Social- og Ældreministeriet</p>
                                    <p className="text-sm">Holmens Kanal 22</p>
                                    <p className="text-sm">1060 København K</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contact */}
                    <section className="bg-red-50 py-20 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-red-800 mb-4">Akut Hjælp</h2>
                                <p className="text-lg text-red-700 max-w-2xl mx-auto">
                                    I akutte situationer hvor der er fare for børns sikkerhed eller velfærd
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                            <Phone className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-red-800">Politi</h3>
                                            <p className="text-red-600 font-semibold">112</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Ring 112 ved akut fare for liv og førlighed. Politiets alarmcentral er døgnbemandet.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                            <Phone className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-red-800">BørneTelefonen</h3>
                                            <p className="text-red-600 font-semibold">116 111</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Anonym rådgivning for børn og unge. Åben alle dage døgnet rundt.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section className="bg-white py-20 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">Send os en Besked</h2>
                                <p className="text-lg text-slate-600">
                                    Har du spørgsmål eller brug for hjælp? Udfyld formularen nedenfor
                                </p>
                            </div>

                            <form className="bg-slate-50 p-8 rounded-xl shadow-md border border-slate-200">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Navn *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Dit fulde navn"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="din@email.dk"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Emne *
                                    </label>
                                    <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Vælg emne...</option>
                                        <option>Tekniske problemer</option>
                                        <option>Spørgsmål om tjenester</option>
                                        <option>Juridisk rådgivning</option>
                                        <option>Support til eksisterende sag</option>
                                        <option>Andet</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Besked *
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Beskriv dit spørgsmål eller problem..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">
                                        * Påkrævet felt
                                    </p>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Send Besked
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
                <GuestFooter />
            </div>
        </>
    );
}
