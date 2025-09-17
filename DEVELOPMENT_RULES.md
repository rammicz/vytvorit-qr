# Pravidla pro vývoj - Vytvořte QR kód

## 🚀 Před každým pushnutím

### 1. Lokální testování
```bash
# VŽDY spustit před pushnutím
npm run build

# Pokud máš Docker Desktop spuštěný
docker build -t vytvorit-qr-local .
```

### 2. TypeScript kontrola
- Všechny TypeScript chyby MUSÍ být opraveny před pushnutím
- Používat `tsc --noEmit` pro rychlou kontrolu bez buildu
- Nepoužívané proměnné/funkce/props MUSÍ být odstraněny

## 🐳 Docker & Cloud Run pravidla

### 3. Port konfigurace
- **Cloud Run** vždy používá `PORT` environment variable (výchozí 8080)
- **Nginx** musí naslouchat na dynamickém portu, ne na pevném 80
- Používat startup script pro nahrazení portu v runtime

### 4. Dependencies
- **Build stage** MUSÍ instalovat VŠECHNY dependencies (včetně devDependencies)
- Používat `npm ci` místo `npm ci --only=production` pro build
- DevDependencies se odstraní automaticky v multi-stage build

### 5. Region optimalizace
- Pro ČR používat `europe-central2` (Warsaw) - nejlepší latence
- Alternativně `europe-west3` (Frankfurt) - také dobré pro ČR
- **NE** `europe-west1` (Belgium) - příliš daleko

## 📝 Commit pravidla

### 6. Commit messages
```
fix: popis opravy
feat: popis nové funkce
docs: změny v dokumentaci
style: formátování, bez změn logiky
refactor: refaktoring kódu
```

### 7. Atomic commits
- Jeden commit = jedna logická změna
- Necommituj nefunkční kód
- Testovat před každým commitem

## 🔧 Troubleshooting checklist

### 8. Build selhává?
- [ ] `npm run build` funguje lokálně?
- [ ] Všechny TypeScript chyby opraveny?
- [ ] DevDependencies nainstalovány v Dockerfile?
- [ ] Port správně nakonfigurován pro Cloud Run?

### 9. Cloud Run deployment selhává?
- [ ] Container naslouchá na `PORT` environment variable?
- [ ] Startup script má správná oprávnění (`chmod +x`)?
- [ ] Nginx konfigurace používá dynamický port?
- [ ] Cloud Run service má správný port nastavený?

### 10. Performance problémy?
- [ ] Správný region pro cílovou lokalitu?
- [ ] Bundle size pod kontrolou (< 250 kB gzip)?
- [ ] Gzip komprese zapnutá?
- [ ] Cache headers správně nastavené?

## 🎯 Quick fixes

### TypeScript chyby
```bash
# Rychlá kontrola
npx tsc --noEmit

# Oprava automatických chyb
npx tsc --noEmit --fix
```

### Docker build
```bash
# Lokální test
docker build -t test .

# Spuštění kontejneru
docker run -p 8080:8080 -e PORT=8080 test
```

### Cloud Run debug
```bash
# Logy služby
gcloud run services logs vytvorit-qr --region=europe-central2

# Popis služby
gcloud run services describe vytvorit-qr --region=europe-central2
```

## 📋 Pre-deployment checklist

- [ ] `npm run build` prošel bez chyb
- [ ] Všechny TypeScript chyby opraveny
- [ ] Docker build funguje lokálně (pokud je Docker dostupný)
- [ ] Commit message je popisný
- [ ] Změny jsou atomic a funkční
- [ ] Region je optimalizovaný pro cílovou lokalitu

---

**Zapamatuj si:** Vždy testuj lokálně před pushnutím! 🚀
