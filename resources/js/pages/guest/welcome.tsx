import { AIChatModal } from '@/components/ai-chat-modal';
import { Head } from '@inertiajs/react';
import { FileText, ShieldCheck, Lock, Sparkles, Shield, Scale } from "lucide-react";
import { Suspense, useState } from 'react';
import GuestNav from '@/components/guest-nav';
import GuestFooter from '@/components/guest-footer';
import { __ } from '@/lib/translations';

export default function Welcome() {
    const [aiModalOpen, setAIModalOpen] = useState(false);

    // Partner logos - automatically scanned from public/img/partners/
    const partnerLogos = [
        { filename: 'Gbys_foraeldremyndighed_web_logo_AM_190321_vers1.png', alt: 'Gbys Forældremyndighed' },
        { filename: 'Screenshot 2025-09-20 at 10.17.05.png', alt: 'Familieadvokat Partner' },
        { filename: 'Screenshot 2025-09-20 at 10.17.45.png', alt: 'Socialrådgiver Partner' },
        { filename: 'cropped-jm-logo.png', alt: 'JM Familieadvokater' },
        { filename: 'logo-2x.png', alt: 'Juridisk Partner' },
        { filename: 'logo-danske-familieadvokater.svg', alt: 'Danske Familieadvokater' },
        { filename: 'logo_mus2Vk.svg', alt: 'Familieretslig Konsulent' },
        { filename: 'sb-v2.svg', alt: 'SB Advokatfirma' },
    ];

    return (
        <>
            <Head title="Welcome">
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
                <div className="min-h-screen bg-background p-8 text-foreground">
                    {/* Trust Indicators */}
                    <div className="max-w-7xl mx-auto mb-8">
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
                                {__('welcome.hero.justice_security_family_law')}
                            </h1>

                            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                                {__('welcome.hero.platform_description')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <button
                                    onClick={() => setAIModalOpen(true)}
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Sparkles className="h-5 w-5" />
                                    {__('welcome.hero.start_case_processing')}
                                </button>
                                <button className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-200">
                                    <FileText className="h-5 w-5" />
                                    {__('welcome.hero.read_guidance')}
                                </button>
                            </div>

                            {/* Authority Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>{__('welcome.hero.ministry_approved')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>{__('welcome.hero.legally_valid')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span>{__('welcome.hero.support_24_7')}</span>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Core Features */}
                    <section className="max-w-6xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <div className="mb-4">
                                <span className="text-xl font-bold tracking-wide text-blue-300">{__('welcome.features.section_title')}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">{__('welcome.features.section_title')}</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                {__('welcome.features.section_description')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">{__('welcome.features.legal_security.title')}</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    {__('welcome.features.legal_security.description')}
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>{__('welcome.features.legal_security.badge')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                                    <Sparkles className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">{__('welcome.features.ai_advice.title')}</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    {__('welcome.features.ai_advice.description')}
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-600 font-medium">
                                    <Sparkles className="h-4 w-4" />
                                    <span>{__('welcome.features.ai_advice.badge')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                    <Lock className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">{__('welcome.features.confidentiality_support.title')}</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    {__('welcome.features.confidentiality_support.description')}
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                                    <Lock className="h-4 w-4" />
                                    <span>{__('welcome.features.confidentiality_support.badge')}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Partners Section */}
                    <section className="bg-slate-50 py-20 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">{__('welcome.partners.title')}</h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    {__('welcome.partners.description')}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center justify-items-center">
                                {partnerLogos.map((logo, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center p-6 hover:opacity-90 transition-all duration-200 bg-white rounded-lg hover:bg-slate-50 min-h-[100px] w-full shadow-sm hover:shadow-md border border-slate-200"
                                    >
                                        <img
                                            src={`/img/partners/${logo.filename}`}
                                            alt={logo.alt}
                                            className="max-h-12 max-w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <p className="text-sm text-slate-500">
                                    {__('welcome.partners.support_mission')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Credibility & Authority Section */}
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

                            <div className="text-center mt-12 pt-8 border-t border-slate-700">
                                <p className="text-slate-400 text-sm">
                                    {__('welcome.authority.platform_description')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Comprehensive Footer */}
                    <GuestFooter />

                </div>
                <div className="hidden h-14.5 lg:block"></div>
                <Suspense fallback={null}>
                    {aiModalOpen && (
                        <AIChatModal open={aiModalOpen} onOpenChange={setAIModalOpen} />
                    )}
                </Suspense>
            </div>
        </>
    );
}
