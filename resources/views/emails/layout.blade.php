<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Famlink')</title>
    @stack('styles')
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <img src="{{ asset('img/famlink-logo.png') }}" alt="Famlink" style="max-width: 150px; height: auto;" onerror="this.style.display='none'">
            <h1 style="color: white; margin: 20px 0 0 0; font-size: 24px;">Famlink</h1>
        </div>

        <div style="padding: 40px 30px;">
            @yield('content')
        </div>

        <div style="background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
                Famlink - Digital platform for familier i forbindelse med familie- og samværsretlige sager
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">
                Har du spørgsmål? Kontakt os på <a href="mailto:support@famlink.dk" style="color: #2563eb;">support@famlink.dk</a>
            </p>
        </div>
    </div>
</body>
</html>
