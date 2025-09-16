# Pravidla pro vývoj

## Commitování do GitHubu

### Pravidlo: Schválené a funkční celky commitovat do GitHubu

**Adresa repozitáře**: https://github.com/rammicz/vytvorit-qr

### Kdy commitovat:
- ✅ **Funkční feature** - Kompletní implementace nové funkce
- ✅ **Bug fix** - Oprava chyby s testováním
- ✅ **Refactoring** - Vylepšení kódu bez změny funkcionality
- ✅ **Dokumentace** - Aktualizace README, komentářů
- ✅ **Styling** - Vylepšení UI/UX
- ✅ **Performance** - Optimalizace výkonu

### Kdy NEdělat commit:
- ❌ **Rozbitý kód** - Kód, který nefunguje
- ❌ **Nedokončené funkce** - Částečná implementace
- ❌ **Test kód** - Dočasný kód pro testování
- ❌ **Sensitive data** - API klíče, hesla, osobní údaje

### Commit message formát:
```
type(scope): description

[optional body]

[optional footer]
```

**Typy:**
- `feat`: Nová funkce
- `fix`: Oprava chyby
- `docs`: Dokumentace
- `style`: Formátování, CSS
- `refactor`: Refactoring
- `perf`: Performance
- `test`: Testy
- `chore`: Build, dependencies

**Příklady:**
```
feat(qr): přidání exportu do PDF
fix(forms): oprava validace emailu
docs: aktualizace README
style(ui): vylepšení responzivity
refactor(utils): optimalizace QR generování
```

### Workflow:
1. **Vývoj** - Pracuj na feature v lokální větvi
2. **Testování** - Otestuj funkčnost
3. **Commit** - Commit s popisným message
4. **Push** - Push do GitHubu
5. **Pull Request** - Pro větší změny

### Branching:
- `main` - Produkční kód
- `develop` - Vývojová větev
- `feature/název` - Nové funkce
- `fix/název` - Opravy chyb
- `hotfix/název` - Kritické opravy

### Code Review:
- Všechny PR musí být zkontrolovány
- Minimálně 1 schválení před merge
- Testování na různých prohlížečích
- Kontrola responzivity

### Deployment:
- Automatické nasazení z `main` větve
- GitHub Actions build a deploy
- Custom doména: `qr.aox.cz`
- Statické soubory v `dist/` složce

### Monitoring:
- Sledování výkonu (First Load < 2s)
- Sledování používání funkcí
- Error tracking
- User feedback

### Bezpečnost:
- Žádné sensitive data v kódu
- Validace všech vstupů
- HTTPS pouze
- CSP headers

### Performance:
- Bundle size < 250KB gzip
- Lazy loading komponent
- Optimalizace obrázků
- Caching strategie

### Accessibility:
- WCAG AA compliance
- Keyboard navigation
- Screen reader support
- Kontrastní barvy

### Browser Support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile:
- Responsive design
- Touch friendly
- Fast loading
- Offline capability (PWA ready)
