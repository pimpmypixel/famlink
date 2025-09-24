import { Head, Link } from '@inertiajs/react';
import { FileText, ShieldCheck, Lock, Sparkles, Shield, Scale, Users, Heart, Gavel } from "lucide-react";
import GuestNav from '@/components/guest-nav';
import GuestFooter from '@/components/guest-footer';
import { __ } from '@/lib/translations';
import { login } from '@/routes';

export default function Services() {
    return (
        <>
            <Head title={__('welcome.header.services')}>
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

                    {/* Services Hero */}
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
                                Vores Tjenester
                            </h1>

                            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Familie Link tilbyder omfattende digitale tjenester til støtte for separerede forældre
                                og professionelle i familie- og forældremyndighedssager.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Shield className="h-5 w-5" />
                                    Start Dokumentation
                                </Link>
                                <Link
                                    href="/help"
                                    className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-200"
                                >
                                    <FileText className="h-5 w-5" />
                                    Få Hjælp
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Core Services */}
                    <section className="max-w-6xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Kerneydelser</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Professionelle tjenester designet til at støtte familier gennem udfordrende tider
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Digital Dokumentation</h3>
                                <p className="text-slate-600 text-center leading-relaxed mb-4">
                                    Sikker og juridisk bindende dokumentation af alle aspekter af din sag.
                                    Alle dokumenter krypteres og opbevares i overensstemmelse med dansk lovgivning.
                                </p>
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <ShieldCheck className="h-4 w-4" />
                                        Ministerie-godkendt
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                                    <Sparkles className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">AI-Rådgivning</h3>
                                <p className="text-slate-600 text-center leading-relaxed mb-4">
                                    Intelligent assistance baseret på dansk familieret. Få hjælp til at forstå
                                    komplekse lovtekster og navigere i sagsprocessen.
                                </p>
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-2 text-sm text-purple-600 font-medium">
                                        <Sparkles className="h-4 w-4" />
                                        Specialiseret i Familieret
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Familierådgivning</h3>
                                <p className="text-slate-600 text-center leading-relaxed mb-4">
                                    Professionel rådgivning fra kvalificerede familieterapeuter og jurister.
                                    Alle samtaler er fortrolige og beskyttet af tavshedspligt.
                                </p>
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <Heart className="h-4 w-4" />
                                        Fortrolig & Professionel
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Additional Services */}
                    <section className="bg-slate-50 py-20 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">Yderligere Tjenester</h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    Omfattende støtte gennem hele processen
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Gavel className="h-6 w-6 text-blue-600" />
                                        <h3 className="text-lg font-semibold text-slate-800">Retshjælp</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Juridisk vejledning og assistance i familie- og forældremyndighedssager
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Heart className="h-6 w-6 text-red-600" />
                                        <h3 className="text-lg font-semibold text-slate-800">Psykologisk Støtte</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Professionel psykologisk støtte til børn og voksne i krisesituationer
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Users className="h-6 w-6 text-green-600" />
                                        <h3 className="text-lg font-semibold text-slate-800">Konflikthåndtering</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Mediation og konflikthåndtering mellem parter i familiesager
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="h-6 w-6 text-purple-600" />
                                        <h3 className="text-lg font-semibold text-slate-800">Børnebeskyttelse</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Specialistviden og støtte til sager om børnebeskyttelse og -velfærd
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Scale className="h-6 w-6 text-orange-600" />
                                        <h3 className="text-lg font-semibold text-slate-800">Forældremyndighed</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Sagsbehandling og dokumentation af forældremyndighed og samvær
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                        <h3 className="text-lg font-semibold text-slate-800">Rapportgenerering</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Automatisk generering af rapporter og dokumentation til myndigheder
                                    </p>
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
