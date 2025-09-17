import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Clock, Calendar, Paperclip, MessageSquare, ShieldCheck, FileText, LifeBuoy } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Userguide',
    href: '/userguide',
  },
];

export default function UserGuide() {
  return (

    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Timeline" />
      <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold mb-2">Hvordan bruger du platformen</h1>
            <p className="text-slate-600">Praktisk, trinvis guide der hjælper dig i gang og sikrer korrekt dokumentation af din sag.</p>
          </header>

          <section className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">Hurtig introduktion</h2>
            <p className="text-slate-700 mb-2">
              Platformen er designet som din personlige, sikre dagbog og juridiske assistent i familieretlige sager. Følg nedenstående trin for at få maksimal værdi og sikre, at din dokumentation er brugbar for myndigheder og rådgivere.
            </p>
            <ul className="list-disc list-inside text-slate-700">
              <li>Log hver relevant hændelse så tæt på tidspunktet som muligt.</li>
              <li>Vedhæft beviser (screenshots, beskeder, dokumenter).</li>
              <li>Brug AI-chatten til at forstå juridiske begreber eller opsummere længere dokumenter.</li>
            </ul>
          </section>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="opret-konto">
              <AccordionTrigger>1. Opret konto og sikkerhed</AccordionTrigger>
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
              <AccordionTrigger>2. Opret din første sag</AccordionTrigger>
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
              <AccordionTrigger>3. Log en hændelse (trin for trin)</AccordionTrigger>
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
              <AccordionTrigger>4. Vedhæft beviser og filer</AccordionTrigger>
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
              <AccordionTrigger>5. Brug kalenderen og registrer samvær</AccordionTrigger>
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
              <AccordionTrigger>6. AI-chat & juridisk hjælp</AccordionTrigger>
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
              <AccordionTrigger>7. Generer rapporter og del sikkert</AccordionTrigger>
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
              <AccordionTrigger>8. Privatliv & sikkerhed</AccordionTrigger>
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
              <AccordionTrigger>9. Ofte stillede spørgsmål (FAQ)</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-slate-700">
                  <li><strong>Er mine data juridisk gyldige?</strong> Ja — digitale dokumenter og tidsstempler kan anvendes som dokumentation, men opbevar originalfiler hvis muligt.</li>
                  <li><strong>Kan jeg slette min konto?</strong> Ja — sletning fjerner dine data permanent. Eksporter først hvis du vil gemme en kopi.</li>
                  <li><strong>Hvor sikker er AI-chatten?</strong> AI-processering sker i miljøer med høj sikkerhed; del ikke ekstraordinært følsomme oplysninger uden rådgivning.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support">
              <AccordionTrigger>10. Brugersupport og ressourcer</AccordionTrigger>
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

          <footer className="mt-8 text-sm text-slate-600">
            <p>
              Har du forslag til forbedringer af guiden? Send feedback via appens feedback-funktion — vi prioriterer løbende forbedringer baseret på brugernes erfaringer.
            </p>
          </footer>
        </div>
      </div>
    </AppLayout>
  );
}
