import AppLayout from '@/layouts/app-layout';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Download, FileText, ShieldCheck, Lock, Sparkles } from "lucide-react";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="min-h-screen bg-background p-8 text-foreground">
                    <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20 px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl font-extrabold mb-4">En ny standard for retfærdighed i familieretlige sager</h1>
                            <p className="text-lg text-slate-200 mb-6">
                                Vores platform hjælper separerede forældre med at dokumentere deres forløb – sikkert, privat og understøttet af AI.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-200">
                                    Kom i gang gratis
                                </button>
                                <button className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-slate-800">
                                    Læs mere
                                </button>
                            </div>
                        </div>
                    </section>


                    {/* Salgspitch med fokus på privatliv og AI */}
                    <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl font-bold mb-4">Privatliv i centrum</h2>
                            <p className="mb-4 text-slate-700">
                                Alle dine oplysninger gemmes krypteret og kun du bestemmer, hvem der får adgang. Vores mål er at gøre dig tryg i en sårbar proces, hvor hvert dokument kan have afgørende betydning.
                            </p>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Lock className="w-5 h-5" />
                                <span>Krypteret datalagring & fuld kontrol</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl font-bold mb-4">AI-forbedret rådgivning</h2>
                            <p className="mb-4 text-slate-700">
                                Få adgang til en intelligent chat, der kan hjælpe dig med at forstå lovgivning, dine rettigheder og næste skridt i sagsbehandlingen. AI kan også opsummere lange dokumenter og foreslå mulige handleplaner.
                            </p>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Sparkles className="w-5 h-5" />
                                <span>AI-assistance til lovgivning & dokumentation</span>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
