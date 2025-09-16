import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Download, FileText, ShieldCheck, Lock, Sparkles } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Projektbeskrivelse',
    href: '/intro',
  },
];

export default function ProjektbeskrivelseApp() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Projektbeskrivelse" />
      <div className="min-h-screen bg-background p-8 text-foreground">
        {/* Salgspitch med fokus på privatliv og AI */}
        <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-12">
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
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold mb-2 text-foreground">Projektbeskrivelse</h1>
            <p className="text-muted-foreground text-lg">Online platform til separerede forældre</p>
          </header>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="formaal">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">1. Projektets formål</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-foreground">At skabe en digital platform (web + mobil) målrettet separerede forældre i sager ved Familieretshuset og i forbindelse med forældremyndighed.</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Styrke forældrenes retssikkerhed gennem neutral, struktureret dokumentation.</li>
                  <li>Reducere konfliktniveauet via struktur og standardiseret sagsdokumentation.</li>
                  <li>Giv myndigheder og advokater et klart, faktabaseret beslutningsgrundlag.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="funktioner">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">2. Primære funktioner</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border border-border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 text-card-foreground">Individuel sagslog</h3>
                    <p className="text-sm text-muted-foreground">Log hændelser med dato, kategori, beskrivelse og vedhæftede filer.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 text-card-foreground">Tidslinje & struktur</h3>
                    <p className="text-sm text-muted-foreground">Kronologisk tidslinje med filtrering og eksport (PDF/rapport).</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 text-card-foreground">Dokumentationsværktøjer</h3>
                    <p className="text-sm text-muted-foreground">Neutral rapportgenerator, adskilte noter og cases.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 text-card-foreground">Kommunikation & arkiv</h3>
                    <p className="text-sm text-muted-foreground">Sikkert arkiv med OCR/tekstgenkendelse for søgbarhed.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 text-card-foreground">Kalender & samværsoversigt</h3>
                    <p className="text-sm text-muted-foreground">Markér aftaler, afvigelser og sammenhold med loggede hændelser.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 text-card-foreground">Juridisk støtte</h3>
                    <p className="text-sm text-muted-foreground">Vidensbank, guides og henvisninger til rådgivning.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maalgruppe">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">3. Målgruppe</AccordionTrigger>
              <AccordionContent>
                <p className="text-foreground">Primært: forældre i konfliktfyldte samværs- og forældremyndighedssager. Sekundært: advokater, mediatorer, psykologer og myndigheder.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="teknisk">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">4. Teknisk løsning</AccordionTrigger>
              <AccordionContent>
                <h4 className="font-semibold text-card-foreground">Frontend</h4>
                <p className="text-sm mb-2 text-muted-foreground">React (web) &amp; React Native eller Flutter (mobil). Tailwind CSS for UI.</p>
                <h4 className="font-semibold text-card-foreground">Backend</h4>
                <p className="text-sm mb-2 text-muted-foreground">API-baseret (Node.js/Express eller Django/DRF). PostgreSQL, S3-kompatibel storage.</p>
                <h4 className="font-semibold text-card-foreground">Sikkerhed</h4>
                <p className="text-sm text-muted-foreground">End-to-end kryptering, GDPR, 2FA, audit logs, mulighed for anonym konto.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faser">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">5. Projektets faser</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal list-inside text-muted-foreground">
                  <li><strong className="text-foreground">Fase 1:</strong> Koncept & MVP – basisfunktioner og pilottest.</li>
                  <li><strong className="text-foreground">Fase 2:</strong> Udvidet funktionalitet – kalenderintegration, OCR, vidensbank.</li>
                  <li><strong className="text-foreground">Fase 3:</strong> Skalering – partnerskaber, professionel portal, internationalisering.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="finansiering">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">6. Finansiering & forretningsmodel</AccordionTrigger>
              <AccordionContent>
                <p className="text-foreground">Freemium-model: gratis basis (dagbog + tidslinje). Premium: avanceret rapportering, OCR, ekstra lagerplads. Mulige tilskud fra fonde og partnerskaber.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="effekt">
              <AccordionTrigger className="text-xl font-semibold hover:text-primary">7. Forventet effekt</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Faktabaseret dokumentation reducerer konflikter og misforståelser.</li>
                  <li>Bedre beslutningsgrundlag for myndigheder.</li>
                  <li>Mere stabile rammer for børnene.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* <footer className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sikkerhed & privatliv prioriteres</span>
            </div>
          </footer> */}
        </div>
      </div>
    </AppLayout>
  );
}
