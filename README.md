# Vytvořte QR za 10 s

Webová aplikace pro rychlé vytvoření QR kódů pro URL, Wi-Fi a vCard s možností přizpůsobení a exportu.

## Funkce

### Typy QR kódů
- **URL** - Webové odkazy
- **Wi-Fi** - Připojení k Wi-Fi síti (SSID, heslo, typ zabezpečení)
- **vCard** - Kontaktní informace (jméno, telefon, email, adresa)

### Přizpůsobení
- **Barvy** - Vlastní barvy popředí a pozadí
- **Velikost** - 256px, 512px, 1024px
- **Korekce chyb** - L (7%), M (15%), Q (25%), H (30%)
- **Quiet zone** - 4-8 modulů
- **Obsah ve středu** - Text nebo logo (PNG/SVG, max 100KB)

### Export a sdílení
- **Formáty** - PNG, SVG, PDF
- **Kopírování** - Do schránky
- **Sdílení** - Permalink přes URL hash
- **Validace** - Kontrola čitelnosti a varování

## Technologie

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **QR generování**: qrcode.js
- **Export**: jsPDF, html2canvas
- **Styling**: CSS s custom properties
- **Ikony**: Lucide React

## Instalace a spuštění

```bash
# Instalace závislostí
npm install

# Vývojový server
npm run dev

# Build pro produkci
npm run build

# Náhled produkčního buildu
npm run preview
```

## Struktura projektu

```
src/
├── components/
│   ├── forms/          # Formuláře pro různé typy QR
│   ├── QRPreview.tsx   # Náhled QR kódu
│   └── CustomizationPanel.tsx # Panel přizpůsobení
├── utils/
│   ├── qrGenerator.ts  # Generování QR kódů
│   ├── exportUtils.ts  # Export funkcionalita
│   └── permalinkUtils.ts # URL hash systém
├── types/
│   └── index.ts        # TypeScript typy
├── App.tsx             # Hlavní komponenta
└── main.tsx           # Entry point
```

## Specifikace

### Wi-Fi formát
```
WIFI:T:<WPA|WEP|nopass>;S:<SSID>;P:<password>;H:<true|false>;;
```

### vCard formát
```
BEGIN:VCARD
VERSION:3.0
N:Příjmení;Jméno;;;
FN:Jméno Příjmení
TEL;TYPE=CELL:+420123456789
EMAIL;TYPE=INTERNET:uzivatel@example.com
URL:https://aox.cz
END:VCARD
```

## Nasazení

Aplikace je připravena pro statické nasazení na `qr.aox.cz`:

1. Build: `npm run build`
2. Upload `dist/` složky na webový server
3. Konfigurace serveru pro SPA routing

## Metriky úspěchu

- **TTFQR** (time to first QR) < 10s
- **Stažení** na návštěvu > 40%
- **Použití středu** 25-50% QR
- **Varování čitelnosti** < 20%

## Licence

© 2024 AOX.cz
