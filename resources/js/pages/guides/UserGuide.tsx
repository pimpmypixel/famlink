import { Head } from '@inertiajs/react';
import { FileText, HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import { __ } from '@/lib/translations';

export default function UserGuide() {
    return (
        <>
            <Head title="Brugervejledning">
                <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
            </Head>

            <div className="min-h-screen bg-background p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <HelpCircle className="h-12 w-12 text-blue-600 mr-4" />
                            <h1 className="text-4xl font-bold text-foreground">Brugervejledning</h1>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            Lær hvordan du bruger Famlink platformen effektivt
                        </p>
                    </div>

                    {/* Guide Sections */}
                    <div className="space-y-8">
                        {/* Getting Started */}
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <div className="flex items-center mb-4">
                                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold">Kom i gang</h2>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-muted-foreground mb-4">
                                    Velkommen til Famlink! Denne guide hjælper dig med at komme i gang med platformen.
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>Log ind med dine legitimationsoplysninger</li>
                                    <li>Udforsk dashboardet for at se systemoversigten</li>
                                    <li>Tilgå tidslinjen for at se sagsindlæg</li>
                                    <li>Brug søge- og filtreringsfunktionerne</li>
                                </ul>
                            </div>
                        </div>

                        {/* Timeline Features */}
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <div className="flex items-center mb-4">
                                <FileText className="h-6 w-6 text-green-600 mr-3" />
                                <h2 className="text-2xl font-semibold">Tidslinje funktioner</h2>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-muted-foreground mb-4">
                                    Tidslinjen er hjertet af Famlink platformen, hvor du kan dokumentere og følge sagsforløb.
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li><strong>Tilføj sagsindlæg:</strong> Klik på "Tilføj Sagsindlæg" for at oprette nye indlæg</li>
                                    <li><strong>Kategorisering:</strong> Brug kategorier og tags til at organisere indhold</li>
                                    <li><strong>Kommentarer:</strong> Tilføj kommentarer til eksisterende indlæg</li>
                                    <li><strong>Fil upload:</strong> Vedhæft relevante dokumenter og billeder</li>
                                    <li><strong>Søg og filtrer:</strong> Find specifikke indlæg hurtigt</li>
                                </ul>
                            </div>
                        </div>

                        {/* Communication */}
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <div className="flex items-center mb-4">
                                <MessageSquare className="h-6 w-6 text-purple-600 mr-3" />
                                <h2 className="text-2xl font-semibold">Kommunikation</h2>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-muted-foreground mb-4">
                                    Famlink faciliterer sikker kommunikation mellem alle parter i sagsforløbet.
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li><strong>Privat kommunikation:</strong> Mulighed for private kommentarer</li>
                                    <li><strong>AI-assisteret rådgivning:</strong> Få hjælp fra vores AI-assistent</li>
                                    <li><strong>Dokumentation:</strong> Alt kommunikation bliver logget og gemt</li>
                                    <li><strong>Sikkerhed:</strong> Krypteret kommunikation beskytter dine data</li>
                                </ul>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <div className="flex items-center mb-4">
                                <HelpCircle className="h-6 w-6 text-orange-600 mr-3" />
                                <h2 className="text-2xl font-semibold">Support og hjælp</h2>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-muted-foreground mb-4">
                                    Har du brug for hjælp? Vi er her for at assistere dig.
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li><strong>Online hjælp:</strong> Brug AI-chatten til øjeblikkelig hjælp</li>
                                    <li><strong>Dokumentation:</strong> Denne brugervejledning og andre ressourcer</li>
                                    <li><strong>Support kontakt:</strong> Kontakt os via kontaktformularen</li>
                                    <li><strong>Opdateringer:</strong> Hold dig opdateret med nye funktioner</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 pt-8 border-t border-border">
                        <p className="text-muted-foreground">
                            Har du stadig spørgsmål? <a href="/contact" className="text-blue-600 hover:underline">Kontakt os</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
