import { Head, Link } from '@inertiajs/react';
import { FileText, ShieldCheck, Lock, Sparkles, Shield, Scale, HelpCircle, Book, MessageCircle, Phone, Clock, Calendar, Paperclip, LifeBuoy, MessageSquare } from "lucide-react";
import GuestNav from '@/components/guest-nav';
import GuestFooter from '@/components/guest-footer';
import { __ } from '@/lib/translations';
import { login } from '@/routes';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Force cache invalidation - updated at 2025-09-24

export default function Help() {
    return (
        <>
            <Head title={__('welcome.header.help')}>
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

                    {/* Help Hero */}
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
                                Hjælp & Support
                            </h1>

                            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Få den hjælp du har brug for. Vi tilbyder omfattende support, guider og ressourcer
                                til at navigere i familie- og forældremyndighedssager.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Shield className="h-5 w-5" />
                                    Start Din Sag
                                </Link>
                                <Link
                                    href="#faq"
                                    className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-200"
                                >
                                    <HelpCircle className="h-5 w-5" />
                                    Ofte Stillede Spørgsmål
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Help Categories */}
                    <section className="max-w-6xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Sådan Kan Vi Hjælpe</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Få adgang til vores omfattende hjælperessourcer og supporttjenester
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                    <Book className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Vejledninger</h3>
                                <p className="text-slate-600 text-center leading-relaxed mb-4">
                                    Trin-for-trin guider til at komme i gang med Familie Link og forstå
                                    processen i familie- og forældremyndighedssager.
                                </p>
                                <div className="text-center">
                                    <Link href="#guides" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Læs Vejledninger →
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                    <MessageCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Support Chat</h3>
                                <p className="text-slate-600 text-center leading-relaxed mb-4">
                                    Få hjælp fra vores AI-assistent eller chat med kvalificerede
                                    familieterapeuter og jurister døgnet rundt.
                                </p>
                                <div className="text-center">
                                    <Link href="#chat" className="text-green-600 hover:text-green-800 font-medium">
                                        Start Chat →
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                                    <Phone className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-slate-800">Telefon Support</h3>
                                <p className="text-slate-600 text-center leading-relaxed mb-4">
                                    Tal direkte med vores supportteam. Tilgængelig alle hverdage
                                    fra kl. 8-16 og akut support døgnet rundt.
                                </p>
                                <div className="text-center">
                                    <Link href="#contact" className="text-purple-600 hover:text-purple-800 font-medium">
                                        Ring Nu →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Guide Section */}
                    <section id="guides" className="max-w-4xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Sådan bruger du platformen</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Praktisk, trinvis guide der hjælper dig i gang og sikrer korrekt dokumentation af din sag.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h3 className="text-xl font-semibold mb-3">Hurtig introduktion</h3>
                            <p className="text-slate-700 mb-2">
                                Platformen er designet som din personlige, sikre dagbog og juridiske assistent i familieretlige sager. Følg nedenstående trin for at få maksimal værdi og sikre, at din dokumentation er brugbar for myndigheder og rådgivere.
                            </p>
                            <ul className="list-disc list-inside text-slate-700">
                                <li>Log hver relevant hændelse så tæt på tidspunktet som muligt.</li>
                                <li>Vedhæft beviser (screenshots, beskeder, dokumenter).</li>
                                <li>Brug AI-chatten til at forstå juridiske begreber eller opsummere længere dokumenter.</li>
                            </ul>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="opret-konto">
                                <AccordionTrigger className="text-lg font-semibold">1. Opret konto og sikkerhed</AccordionTrigger>
                                <AccordionContent>
                                    <ol className="list-decimal list-inside text-slate-700">
                                        <li>
                                            <strong>Opret konto:</strong> Brug en e-mail du har adgang til. Du kan vælge et brugernavn fremfor dit fulde navn, hvis du ønsker anonymitet.
                                        </li>
                                        <li>
                                            <strong>To-faktor-godkendelse (2FA):</strong> Aktivér 2FA for ekstra sikkerhed. Det anbefales altid for følsomme sager.
                                        </li>
                                        <li>
                                            <strong>Adgangskontrol:</strong> Al data krypteres. Kun du (og de personer du eksplicit deler med) kan få adgang til dine sager.
                                        </li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="opret-sag">
                                <AccordionTrigger className="text-lg font-semibold">2. Opret din første sag</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-2">Opret en sag per forløb (fx "Samvær - 2025" eller "Økonomi og aftaler"). Hver sag fungerer som en separat mappe til dine hændelser og dokumenter.</p>
                                    <ul className="list-disc list-inside text-slate-700">
                                        <li>Angiv en kort titel og en beskrivelse.</li>
                                        <li>Vælg om sagen skal være privat eller delebar (fx med advokat).</li>
                                        <li>Angiv relevante metadata: modpartens rolle (fx "barnets anden forælder"), barnets alder, vigtige datoer.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="log-haendelse">
                                <AccordionTrigger className="text-lg font-semibold">3. Log en hændelse (trin for trin)</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-3">Når noget sker, der er relevant for sagen, bør du logge det straks. Følg disse felter når du opretter en hændelse:</p>
                                    <ol className="list-decimal list-inside text-slate-700 mb-3">
                                        <li><strong>Dato & klokkeslæt:</strong> Vælg det præcise tidspunkt.</li>
                                        <li><strong>Kategori:</strong> (fx Samvær, Kommunikation, Økonomi, Trivsel).</li>
                                        <li><strong>Kort beskrivelse:</strong> Et par sætninger der opsummerer hvad der skete.</li>
                                        <li><strong>Detaljeret notat:</strong> Udfyld fakta — hvem gjorde hvad, hvor og hvordan. Undgå vurderende ord; hold dig til fakta.</li>
                                        <li><strong>Markér som kritisk:</strong> Hvis hændelsen har akut betydning (fx omsorgssvigt, trusler), marker den som kritisk.</li>
                                    </ol>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Clock className="w-5 h-5" />
                                        <span>Pro tip: Log straks efter hændelsen for at sikre nøjagtighed.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="vedhaeft-bevis">
                                <AccordionTrigger className="text-lg font-semibold">4. Vedhæft beviser og filer</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-2">Du kan vedhæfte billeder, screenshots, lydnoter og dokumenter til hver hændelse.</p>
                                    <ul className="list-disc list-inside text-slate-700 mb-3">
                                        <li>Brug klare filnavne (fx "sms_fra_2025-03-01.jpg").</li>
                                        <li>Upload originale filer når muligt (i stedet for beskårne skærmbilleder).</li>
                                        <li>Systemet kan køre OCR på billeder for at gøre tekst søgbar.</li>
                                    </ul>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Paperclip className="w-5 h-5" />
                                        <span>Filstørrelse: Vi anbefaler billeder &lt; 5MB — systemet komprimerer ved behov.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="kalender">
                                <AccordionTrigger className="text-lg font-semibold">5. Brug kalenderen og registrer samvær</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-2">Kalenderen hjælper dig med at holde styr på aftaler, aflysninger og ferieordninger.</p>
                                    <ul className="list-disc list-inside text-slate-700 mb-3">
                                        <li>Opret tilbagevendende samværsaftaler for at bygge en automatisk historik.</li>
                                        <li>Marker afvigelser (aflysninger, ændrede afhentningstidspunkter) og link dem til relevante hændelser.</li>
                                        <li>Eksporter kalenderoversigt til PDF til brug i møder eller ved indsendelse til Familieretshuset.</li>
                                    </ul>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Calendar className="w-5 h-5" />
                                        <span>Tip: Notér også små afvigelser — sammenhængen giver ofte mening først i retrospekt.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="ai-chat">
                                <AccordionTrigger className="text-lg font-semibold">6. AI-chat & juridisk hjælp</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-2">AI-chatten er et supplement til professionel rådgivning — den hjælper dig med at forstå lovgivning, formulere breve og opsummere dokumenter.</p>
                                    <ul className="list-disc list-inside text-slate-700 mb-3">
                                        <li>Stil konkrete spørgsmål (fx "Hvilke rettigheder har jeg ved aflyst samvær?").</li>
                                        <li>Du kan uploade et dokument og bede om en kort opsummering eller nøglepunkter.</li>
                                        <li>AI'en kan foreslå neutrale formuleringer til kommunikation, som er mindre konfrontatoriske.</li>
                                    </ul>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <MessageSquare className="w-5 h-5" />
                                        <span>Vigtigt: AI er vejledende — brug altid professionel rådgivning ved komplekse eller kritiske sager.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="rapportering">
                                <AccordionTrigger className="text-lg font-semibold">7. Generer rapporter og del sikkert</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-2">Når du har logget hændelser, kan du generere en neutral, faktabaseret rapport til Familieretshuset eller din advokat.</p>
                                    <ul className="list-disc list-inside text-slate-700 mb-3">
                                        <li>Vælg periode og kategorier til rapporten.</li>
                                        <li>Rapporten kan inkludere vedhæftede beviser som separate filer eller indlejrede noter.</li>
                                        <li>Del via sikker link eller eksportér som krypteret PDF.</li>
                                    </ul>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <FileText className="w-5 h-5" />
                                        <span>Tip: Gennemgå rapporten, fjern personfølsomme noter, og sørg for at fakta er korrekte, før du deler.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="privatliv">
                                <AccordionTrigger className="text-lg font-semibold">8. Privatliv & sikkerhed</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-2">Vi tager privatliv alvorligt. Her er hvad du bør vide:</p>
                                    <ul className="list-disc list-inside text-slate-700 mb-3">
                                        <li>Alle data er krypteret i hvile og under transport.</li>
                                        <li>Vi gemmer kun hvad du vælger at gemme — sletning er permanent (men vi anbefaler at eksportere først).</li>
                                        <li>Del kun med betroede personer (fx advokat) via sikre delingsindstillinger.</li>
                                    </ul>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>Har du brug for ekstra anonymitet? Opret en konto med pseudonym.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faqs">
                                <AccordionTrigger className="text-lg font-semibold">9. Ofte stillede spørgsmål (FAQ)</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc list-inside text-slate-700">
                                        <li><strong>Er mine data juridisk gyldige?</strong> Ja — digitale dokumenter og tidsstempler kan anvendes som dokumentation, men opbevar originalfiler hvis muligt.</li>
                                        <li><strong>Kan jeg slette min konto?</strong> Ja — sletning fjerner dine data permanent. Eksporter først hvis du vil gemme en kopi.</li>
                                        <li><strong>Hvor sikker er AI-chatten?</strong> AI-processering sker i miljøer med høj sikkerhed; del ikke ekstraordinært følsomme oplysninger uden rådgivning.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="support">
                                <AccordionTrigger className="text-lg font-semibold">10. Brugersupport og ressourcer</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-slate-700 mb-3">Hvis du har brug for hjælp, kan du:</p>
                                    <ul className="list-disc list-inside text-slate-700">
                                        <li>Brug den indbyggede supportchat i appen.</li>
                                        <li>Se vores detaljerede hjælpeguides i Vidensbanken.</li>
                                        <li>Kontakt vores support via e-mail for tekniske eller kontorelaterede spørgsmål.</li>
                                    </ul>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <LifeBuoy className="w-5 h-5" />
                                        <span>Akut situation? Kontakt altid de relevante myndigheder først.</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="mt-8 text-sm text-slate-600 text-center">
                            <p>
                                Har du forslag til forbedringer af guiden? Send feedback via appens feedback-funktion — vi prioriterer løbende forbedringer baseret på brugernes erfaringer.
                            </p>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="bg-slate-50 py-20 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">Ofte Stillede Spørgsmål</h2>
                                <p className="text-lg text-slate-600">
                                    Find svar på de mest almindelige spørgsmål om Familie Link
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Hvordan kommer jeg i gang med Familie Link?</h3>
                                    <p className="text-slate-600">
                                        Opret en konto ved at klikke på "Log ind" og derefter "Opret konto". Udfyld dine oplysninger,
                                        og du vil modtage en bekræftelsesmail. Efter verifikation kan du begynde at dokumentere din sag.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Er mine data sikre på platformen?</h3>
                                    <p className="text-slate-600">
                                        Ja, Familie Link lever op til de højeste sikkerhedsstandarder. Alle data krypteres,
                                        og vi overholder GDPR og dansk lovgivning. Kun autoriserede personer har adgang til dine data.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Kan jeg bruge dokumentationen i retten?</h3>
                                    <p className="text-slate-600">
                                        Ja, al dokumentation på Familie Link er juridisk bindende og kan bruges som bevis i retssager.
                                        Platformen er godkendt af Social- og Ældreministeriet og lever op til alle juridiske krav.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Hvad koster det at bruge Familie Link?</h3>
                                    <p className="text-slate-600">
                                        Familie Link er gratis for alle borgere i forbindelse med familie- og forældremyndighedssager.
                                        Platformen finansieres af den danske stat gennem Social- og Ældreministeriet.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Hvordan fungerer AI-rådgivningen?</h3>
                                    <p className="text-slate-600">
                                        Vores AI er specialtrænet i dansk familieret og kan hjælpe med at forstå komplekse lovtekster,
                                        give råd om sagsprocessen og hjælpe med at udarbejde dokumentation. AI'en erstatter ikke juridisk rådgivning.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Support */}
                    <section className="bg-white py-20 px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Få Yderligere Hjælp</h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Kan du ikke finde svar på dit spørgsmål? Kontakt vores supportteam
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                                        <MessageCircle className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Live Chat</h3>
                                    <p className="text-sm text-slate-600 mb-3">Få øjeblikkelig hjælp via chat</p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Start Chat
                                    </button>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                                        <Phone className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Telefon</h3>
                                    <p className="text-sm text-slate-600 mb-3">70 20 00 00<br />Man-Fre 8-16</p>
                                    <button className="text-green-600 hover:text-green-800 font-medium">
                                        Ring Nu
                                    </button>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
                                        <FileText className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Email</h3>
                                    <p className="text-sm text-slate-600 mb-3">support@familielink.dk</p>
                                    <Link href="/contact" className="text-purple-600 hover:text-purple-800 font-medium">
                                        Send Email
                                    </Link>
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
