import { AIChatModal } from '@/components/ai-chat-modal';
import AppLayout from '@/layouts/app-layout';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Download, FileText, ShieldCheck, Lock, Sparkles, LockOpen, Shield, Scale } from "lucide-react";
import { Suspense, useState } from 'react';
import AppLogo from '@/components/app-logo';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
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
                                    <span className="text-sm font-semibold">Officiel Dansk Platform</span>
                                </div>
                                <div className="hidden md:flex items-center space-x-2 text-blue-100">
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">Styret af Social- og Ældreministeriet</span>
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">GDPR Compliant</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-100">
                                <Lock className="h-4 w-4" />
                                <span className="text-xs font-medium">Sikker & Krypteret</span>
                            </div>
                        </div>
                    </div>
                    
                    <nav className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-slate-200">
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <AppLogo className="h-12 w-12" />
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center space-x-6 text-sm">
                                <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Om os</a>
                                <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Tjenester</a>
                                <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Hjælp</a>
                                <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Kontakt</a>
                            </div>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Shield className="h-4 w-4" />
                                    Mit Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    <LockOpen className="h-4 w-4" />
                                    Log ind
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <div className="min-h-screen bg-background p-8 text-foreground">
                    {/* Trust Indicators */}
                    <div className="max-w-7xl mx-auto mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
                            <div className="text-center mb-4">
                                <span className="text-lg font-bold tracking-wide text-blue-700">Din stemme, din styrke</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <span className="font-medium">Officielt Godkendt</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Krypteret Kommunikation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-purple-600" />
                                    <span className="font-medium">GDPR Compliant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-orange-600" />
                                    <span className="font-medium">AI-Støttet Rådgivning</span>
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
                                    <span className="text-lg font-bold tracking-wide text-blue-200">Din stemme, din styrke</span>
                                    <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                                        <Shield className="h-4 w-4" />
                                        Officiel Platform for Familie- og Forældremyndighedssager
                                    </span>
                                </div>
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Retfærdighed og <span className="text-blue-300">Tryghed</span> i Familieretlige Sager
                            </h1>
                            
                            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Vores officielle platform hjælper separerede forældre med at dokumentere deres forløb på en sikker, transparent og juridisk bindende måde. 
                                Understøttet af kunstig intelligens og styret af Social- og Ældreministeriet.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <button
                                    onClick={() => setAIModalOpen(true)} 
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Sparkles className="h-5 w-5" />
                                    Start Din Sagsbehandling
                                </button>
                                <button className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-200">
                                    <FileText className="h-5 w-5" />
                                    Læs Vejledning
                                </button>
                            </div>
                            
                            {/* Authority Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Ministerie-godkendt</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>Juridisk Gyldig</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Core Features */}
                    <section className="max-w-6xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <div className="mb-4">
                                <span className="text-xl font-bold tracking-wide text-blue-300">Din stemme, din styrke</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Officielle Tjenester og Sikkerhed</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Vores platform lever op til de højeste standarder for sikkerhed, juridisk gyldighed og brugervenlighed
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Juridisk Sikkerhed</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    Alle dokumenter opbevares krypteret og juridisk bindende. Vores system lever op til danske lovkrav 
                                    og kan bruges som bevis i retssager. Fuld kontrol over dine data og rettigheder.
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Ministerie-godkendt</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                                    <Sparkles className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">AI-Rådgivning</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    Intelligent assistance hjælper dig med at forstå komplekse lovtekster, udarbejde dokumentation 
                                    og navigere i sagsprocessen. AI'en er trænet på dansk familieret og giver professionel vejledning.
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-600 font-medium">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Specialiseret i Familieret</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                    <Lock className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Fortrolighed & Support</h3>
                                <p className="text-slate-600 text-center leading-relaxed">
                                    Privatliv er altafgørende i følsomme sager. Vi tilbyder 24/7 support fra kvalificerede 
                                    familieterapeuter og jurister. Alle samtaler er fortrolige og beskyttet af tavshedspligt.
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                                    <Lock className="h-4 w-4" />
                                    <span>Tavshedspligt</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Partners Section */}
                    <section className="bg-slate-50 py-20 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">Officielle Partnere & Samarbejdspartnere</h2>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    Familie Link samarbejder med anerkendte organisationer og myndigheder for at sikre den bedste service
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
                                    Disse organisationer støtter Familie Link's mission om retfærdighed og tryghed i familieretlige sager
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Credibility & Authority Section */}
                    <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <div className="mb-4">
                                    <span className="text-xl font-bold tracking-wide text-blue-300">Din stemme, din styrke</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Officiel Platform med Fuld Myndighedsstøtte</h2>
                                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                                    Familie Link er udviklet i samarbejde med Social- og Ældreministeriet og lever op til alle danske standarder for digitale offentlige tjenester
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto">
                                        <Shield className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">Ministerie-godkendt</h3>
                                    <p className="text-sm text-slate-300">Officielt godkendt af Social- og Ældreministeriet</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 mx-auto">
                                        <Lock className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">GDPR Compliant</h3>
                                    <p className="text-sm text-slate-300">Fuld overholdelse af persondataforordningen</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4 mx-auto">
                                        <Scale className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">Juridisk Gyldig</h3>
                                    <p className="text-sm text-slate-300">Alle dokumenter har juridisk vægt i retten</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4 mx-auto">
                                        <ShieldCheck className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="font-bold mb-2">24/7 Support</h3>
                                    <p className="text-sm text-slate-300">Professionel support døgnet rundt</p>
                                </div>
                            </div>
                            
                            <div className="text-center mt-12 pt-8 border-t border-slate-700">
                                <p className="text-slate-400 text-sm">
                                    Familie Link er en del af den danske offentlige digitale infrastruktur og drives efter de højeste standarder for sikkerhed og pålidelighed.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Comprehensive Footer */}
                    <footer className="bg-slate-900 text-white">
                        <div className="max-w-7xl mx-auto px-6 py-16">
                            {/* Main Footer Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-white">Kontakt os</h3>
                                    <div className="space-y-3 text-slate-300">
                                        <div>
                                            <p className="font-medium">Familie Link Support</p>
                                            <p>Telefon: 70 20 00 00</p>
                                            <p>Åbningstider: Man-Fre 8-16</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Akut hjælp</p>
                                            <p>Telefon: 112</p>
                                            <p>Døgnbemandet</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p>support@familielink.dk</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-white">Tjenester</h3>
                                    <ul className="space-y-2 text-slate-300">
                                        <li><a href="#" className="hover:text-white transition-colors">Familierådgivning</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Konflikthåndtering</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Forældremyndighed</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Børnebeskyttelse</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Retshjælp</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Psykologisk støtte</a></li>
                                    </ul>
                                </div>

                                {/* Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-white">Information</h3>
                                    <ul className="space-y-2 text-slate-300">
                                        <li><a href="#" className="hover:text-white transition-colors">Om Familie Link</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Nyheder & Presse</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Statistik & Rapporter</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Lovgivning</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Hjælp & Vejledninger</a></li>
                                    </ul>
                                </div>

                                {/* Emergency & Legal */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-white">Nødsituationer</h3>
                                    <ul className="space-y-2 text-slate-300">
                                        <li><a href="#" className="hover:text-white transition-colors">Børneudsattelelse</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Vold i hjemmet</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Selvmordstanker</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Akut krisehjælp</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Politianmeldelse</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Advokatbistand</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Secondary Footer Links */}
                            <div className="border-t border-slate-700 pt-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    {/* Legal Information */}
                                    <div>
                                        <h4 className="text-md font-semibold mb-3 text-white">Juridisk information</h4>
                                        <ul className="space-y-1 text-sm text-slate-400">
                                            <li><a href="#" className="hover:text-slate-300 transition-colors">Privatlivspolitik</a></li>
                                            <li><a href="#" className="hover:text-slate-300 transition-colors">Cookiepolitik</a></li>
                                            <li><a href="#" className="hover:text-slate-300 transition-colors">Brugervilkår</a></li>
                                            <li><a href="#" className="hover:text-slate-300 transition-colors">Tilgængelighedserklæring</a></li>
                                            <li><a href="#" className="hover:text-slate-300 transition-colors">Databeskyttelse</a></li>
                                        </ul>
                                    </div>

                                    {/* Social Media & Follow */}
                                    <div>
                                        <h4 className="text-md font-semibold mb-3 text-white">Følg os</h4>
                                        <div className="flex space-x-4">
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                                <span className="sr-only">Facebook</span>
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                            </a>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                                <span className="sr-only">Twitter</span>
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                </svg>
                                            </a>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                                <span className="sr-only">LinkedIn</span>
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                </svg>
                                            </a>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                                <span className="sr-only">YouTube</span>
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Newsletter Signup */}
                                    <div>
                                        <h4 className="text-md font-semibold mb-3 text-white">Nyhedsbrev</h4>
                                        <p className="text-sm text-slate-400 mb-3">
                                            Få de seneste opdateringer om familiepolitik og nye tjenester.
                                        </p>
                                        <div className="flex">
                                            <input
                                                type="email"
                                                placeholder="Din email"
                                                className="flex-1 px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded-l-md text-white placeholder-slate-400 focus:outline-none focus:border-slate-500"
                                            />
                                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-md hover:bg-blue-700 transition-colors">
                                                Tilmeld
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Footer */}
                                <div className="border-t border-slate-700 pt-6">
                                    <div className="flex flex-col md:flex-row justify-between items-center">
                                        <div className="text-sm text-slate-400 mb-4 md:mb-0">
                                            <p>&copy; 2025 Familie Link. Alle rettigheder forbeholdes.</p>
                                            <p>Styret af Social- og Ældreministeriet</p>
                                        </div>
                                        <div className="flex space-x-6 text-sm">
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">Sitemap</a>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">RSS</a>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">API</a>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors">Udviklere</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>

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
