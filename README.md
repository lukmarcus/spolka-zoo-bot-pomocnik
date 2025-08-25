# Spółka ZOO - Bot Pomocnik

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - cyfrowy zamiennik dla kart botów.

## 🎮 O projekcie

Ta aplikacja zastępuje fizyczne karty botów (13 kart) w grze planszowej Spółka ZOO. Umożliwia grę z botami, zarządzanie ich kartami i losowanie kart z talii.

### Główne funkcje

- 🤖 Losowanie kart botów z talii 13 kart
- 🎲 Tasowanie i dobieranie kolejnych kart
- 🔄 Reset i przetasowanie talii
- 💾 **NOWE**: Zapisywanie i wczytywanie stanu gry (localStorage)
- 🔗 **NOWE**: Kody gry (tylko w tej samej przeglądarce)
- 📱 Responsywny design dla telefonów (320px+)

## 🚀 Status rozwoju

**Aktualna wersja**: 0.2.1 ✅  
**Status**: Ultra-kompaktowy system kodów gry (cross-device, wielkie litery)  
**Następna wersja**: 0.2.2 - Poprawki modali kopiowania kodu

## 📖 Instrukcja obsługi

### 💾 Zapisywanie gry

Gra **automatycznie zapisuje** się w lokalnej pamięci przeglądarki podczas każdej akcji.

### 🔗 Udostępnianie gry

Kody gry są zawsze generowane wielkimi literami (ZOO + 0-9, A-C) i można je przesyłać między urządzeniami.

1. **Podczas gry** kliknij przycisk **"🔗 Udostępnij grę"**
2. **Skopiuj** wygenerowany kod (np. `ZOOA0CB5938416274`)
3. Kod działa na dowolnym urządzeniu i przeglądarce

### 📥 Wczytywanie gry

1. **W menu głównym** kliknij **"📥 Wczytaj grę"**
2. **Wprowadź kod** wygenerowany wcześniej (wielkie litery)
3. Gra zostanie wczytana jeśli kod jest poprawny

## 📋 Szybki start

### Instalacja

```bash
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik
npm install
npm run dev
```

### Dostępne komendy

```bash
npm run dev     # Uruchomienie serwera deweloperskiego
npm run build   # Build produkcyjny
npm run lint    # Sprawdzenie linting
npm run preview # Podgląd builda
```

## � Dokumentacja

- 📚 **[DOCS.md](DOCS.md)** - Plan rozwoju i przyszłe funkcjonalności
- � **[CHANGELOG.md](CHANGELOG.md)** - Historia zmian i wprowadzonych funkcji  
- 🎮 **[GAME-CODES.md](GAME-CODES.md)** - Instrukcja systemu kodów gry

## 🛠️ Technologie

- React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- CSS Modules + React Router DOM 7.8.1

---

**Autor**: Marek Szumny  
**Repo**: [spolka-zoo-bot-pomocnik](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik)  
**Licencja**: MIT
