@extends('emails.layout')

@section('content')
<div class="email-container">
    <div class="header">
        <h1>Velkommen til Famlink! 🎉</h1>
        <p>Kære {{ $user->name }},</p>
    </div>

    <div class="content">
        <p>Tak for at du har gennemført Famlinks onboarding!</p>

        <p>Vi har modtaget dine svar og er glade for at byde dig velkommen til Famlink. Vi har noteret følgende oplysninger fra din onboarding:</p>

        <div class="answers-section">
            @foreach($answers as $key => $answer)
                @php
                    $questionText = $controller->getQuestionTextByKey($key);
                @endphp
                @if($questionText)
                    <div class="answer-item">
                        <strong>{{ $questionText }}:</strong> {{ $answer }}
                    </div>
                @endif
            @endforeach
        </div>

        <div class="next-steps">
            <h3>Dit næste skridt:</h3>
            <ul>
                <li>Verificer din email-adresse ved at klikke på knappen nedenfor</li>
                <li>Log ind på Famlink for at begynde at bruge platformen</li>
                <li>Udforsk de forskellige funktioner, der kan hjælpe dig</li>
                <li>Kontakt os hvis du har spørgsmål</li>
            </ul>
        </div>

        <div class="cta-section">
            <a href="{{ $verificationUrl }}" class="verify-button">
                Verificer Email
            </a>
        </div>

        <p>Vi håber, at Famlink kan være til gavn for dig og din situation.</p>

        <p>Med venlig hilsen,<br>
        Famlink-teamet</p>
    </div>

    <div class="footer">
        <p>Denne email blev sendt automatisk efter gennemført onboarding.</p>
        <p>Hvis du ikke har bedt om denne email, kan du ignorere den.</p>
    </div>
</div>
@endsection

@push('styles')
<style>
    .email-container {
        max-width: 600px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
    }

    .header {
        text-align: center;
        margin-bottom: 30px;
    }

    .header h1 {
        color: #2563eb;
        margin-bottom: 10px;
    }

    .content {
        margin-bottom: 30px;
    }

    .answers-section {
        background: #f8fafc;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
    }

    .answer-item {
        margin-bottom: 10px;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
    }

    .answer-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }

    .next-steps {
        background: #ecfdf5;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        border-left: 4px solid #10b981;
    }

    .next-steps h3 {
        margin-top: 0;
        color: #065f46;
    }

    .next-steps ul {
        margin: 10px 0 0 0;
        padding-left: 20px;
    }

    .next-steps li {
        margin-bottom: 5px;
    }

    .cta-section {
        text-align: center;
        margin: 30px 0;
    }

    .verify-button {
        display: inline-block;
        background: #2563eb;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        transition: background-color 0.2s;
    }

    .verify-button:hover {
        background: #1d4ed8;
    }

    .footer {
        border-top: 1px solid #e2e8f0;
        padding-top: 20px;
        font-size: 14px;
        color: #64748b;
        text-align: center;
    }
</style>
@endpush
