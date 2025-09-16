# Nastavení vývojového prostředí

## Požadavky

1. **Node.js** (verze 18 nebo vyšší)
   - Stáhněte z [nodejs.org](https://nodejs.org/)
   - Nebo použijte Windows Package Manager:
   ```bash
   winget install --id OpenJS.NodeJS.LTS
   ```

2. **Git** (pro správu verzí)
   - Stáhněte z [git-scm.com](https://git-scm.com/)

## Instalace

1. **Klonování repozitáře**
   ```bash
   git clone https://github.com/rammicz/vytvorit-qr.git
   cd vytvorit-qr
   ```

2. **Instalace závislostí**
   ```bash
   npm install
   ```

3. **Spuštění vývojového serveru**
   ```bash
   npm run dev
   ```

4. **Otevření v prohlížeči**
   - Aplikace bude dostupná na `http://localhost:5173`

## Dostupné příkazy

- `npm run dev` - Vývojový server s hot reload
- `npm run build` - Build pro produkci
- `npm run preview` - Náhled produkčního buildu
- `npm run lint` - Kontrola kódu ESLint

## Struktura projektu

```
vytvorit-qr/
├── src/
│   ├── components/     # React komponenty
│   ├── utils/         # Utility funkce
│   ├── types/         # TypeScript typy
│   └── App.tsx        # Hlavní komponenta
├── public/            # Statické soubory
├── dist/              # Build výstup (generován)
└── package.json       # Závislosti a skripty
```

## Nasazení

### GitHub Pages
1. Push do `main` větve automaticky spustí deployment
2. Aplikace bude dostupná na `https://rammicz.github.io/vytvorit-qr/`
3. Custom doména: `qr.aox.cz`

### Manuální nasazení
```bash
npm run build
# Upload dist/ složky na webový server
```

## Vývoj

### Přidání nového typu QR kódu
1. Rozšiřte `QRType` v `src/types/index.ts`
2. Přidejte formátovací funkci v `src/utils/qrGenerator.ts`
3. Vytvořte formulář v `src/components/forms/`
4. Aktualizujte `DataForm.tsx`

### Přidání nového export formátu
1. Rozšiřte `ExportFormat` v `src/types/index.ts`
2. Implementujte export funkci v `src/utils/exportUtils.ts`
3. Přidejte tlačítko v `CustomizationPanel.tsx`

## Troubleshooting

### Node.js není rozpoznán
- Zkontrolujte, že Node.js je nainstalován: `node --version`
- Restartujte terminál po instalaci Node.js
- Zkontrolujte PATH proměnnou

### Chyby při npm install
- Smažte `node_modules` a `package-lock.json`
- Spusťte `npm install` znovu
- Zkontrolujte verzi Node.js (musí být 18+)

### Build chyby
- Zkontrolujte TypeScript chyby: `npm run lint`
- Zkontrolujte, že všechny importy jsou správné
- Zkontrolujte, že všechny typy jsou definované
