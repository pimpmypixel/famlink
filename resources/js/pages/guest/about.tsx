import { Head, Link } from '@inertiajs/react';
import { FileText, ShieldCheck, Lock, Sparkles, Shield, Scale } from "lucide-react";
import GuestNav from '@/components/guest-nav';
import GuestFooter from '@/components/guest-footer';
import { __ } from '@/lib/translations';
import { login } from '@/routes';

export default function About() {
    return (
        <>
            <Head title={__('welcome.header.about')}>
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

                    {/* About Content */}
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
                                Om Familie Link
                            </h1>

                            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Familie Link er Danmarks officielle digitale platform for separerede forældre i familie- og forældremyndighedssager.
                                Vi hjælper med at dokumentere forløb på en sikker, transparent og juridisk bindende måde.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Shield className="h-5 w-5" />
                                    Kom i Gang
                                </Link>
                                <Link
                                    href="/services"
                                    className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-200"
                                >
                                    <FileText className="h-5 w-5" />
                                    Vores Tjenester
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Mission & Vision */}
                    <section className="max-w-6xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Vores Mission & Vision</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Familie Link arbejder for retfærdighed, tryghed og gennemsigtighed i danske familieretlige sager
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Vores Mission</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    At skabe en sikker og retfærdig platform hvor alle parter i familie- og forældremyndighedssager
                                    kan dokumentere deres sag på en transparent og juridisk bindende måde.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                    <Scale className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Vores Vision</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    En digital fremtid hvor alle familieretlige sager behandles med den største grad af
                                    gennemsigtighed, retfærdighed og respekt for alle involverede parter.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Authority & Credibility */}
                    <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <div className="mb-4">
                                    <span className="text-xl font-bold tracking-wide text-blue-300">{__('welcome.authority.tagline')}</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">{__('welcome.authority.title')}</h2>
                                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                                    {__('welcome.authority.description')}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto">
                                        <Shield className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">{__('welcome.authority.ministry_approved')}</h3>
                                    <p className="text-sm text-slate-300">{__('welcome.authority.ministry_approved_desc')}</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 mx-auto">
                                        <Lock className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">{__('welcome.authority.gdpr_compliant')}</h3>
                                    <p className="text-sm text-slate-300">{__('welcome.authority.gdpr_compliant_desc')}</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4 mx-auto">
                                        <Scale className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">{__('welcome.authority.legally_valid')}</h3>
                                    <p className="text-sm text-slate-300">{__('welcome.authority.legally_valid_desc')}</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4 mx-auto">
                                        <ShieldCheck className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">{__('welcome.authority.support_24_7')}</h3>
                                    <p className="text-sm text-slate-300">{__('welcome.authority.support_24_7_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <GuestFooter />
            </div>
        </>
    );
}
