# Spółka ZOO - Bot Pomocnik

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - cyfrowy zamiennik dla kart botów.

## 🎮 O projekcie

Ta aplikacja zastępuje fizyczne karty botów (13 kart) w grze planszowej Spółka ZOO. Umożliwia grę z botami, zarządzanie ich kartami i losowanie kart z talii.

### Główne funkcje

- 🤖 Losowanie kart dla botów (talia 13 kart) — obsługa 1–4 botów
- 🧩 Tryby gry: wspólna talia lub osobne talie dla każdego bota (v0.4.0)
- 🎲 Tasowanie talii, reset i niezależne tasowanie (reshuffle) per-bot
- 🎯 Dwa inteligentne przyciski akcji: dobierz dla aktualnego bota / dobierz dla następnego bota
- 💾 Ręczne zapisywanie/wczytywanie stanu gry przez kopiowanie/kod (kompatybilne w obrębie tej wersji)
- 🔗 Kompaktowe kody udostępniania (cross-device) + live preview przed wczytaniem
- 🔍 Walidacja kodów gry w czasie rzeczywistym przed załadunkiem
- 📱 Responsywny design (telefony 320px+)
- ⚙️ Implementacja w TypeScript + React (czysta architektura, kontekst gry i reducer)

## 🚀 Status rozwoju

**Aktualna wersja**: 0.4.1 🎯  
**Status**: Stabilizacja Single-Bot format (ZS) + walidacja + roadmapa multi-bot

### 📋 **Roadmapa 0.4.x:**

- **v0.4.1** (current) - ZS Single-Bot + walidacja + docs
- **v0.4.2** (planowane) - ZM Multi-Shared format
- **v0.4.3** (planowane) - ZP Per-Bot format
- **v0.4.4** (planowane) - Comprehensive tests + finalizacja

**🎯 Cel:** Kompletna implementacja wszystkich formatów kodów gry w ramach wersji 0.4.x

## 📖 Instrukcja obsługi

### 🤖 Gra z wieloma botami z jedną talią (v0.3.4+) + osobne talie dla każdego bota (v0.4.0+)

1. **Rozpocznij grę** - kliknij "Rozpocznij grę"
2. **Wybierz liczbę botów** - wybierz od 1 do 4 botów używając stylizowanych przycisków
3. **Automatyczna gra** - gra automatycznie dobiera pierwszą kartę po wyborze botów
4. **Dwa inteligentne przyciski**:
   - **"🎯 Dobierz następną kartę dla bota X"** - dobiera kartę dla aktualnego bota
   - **"👥 Dobierz kartę dla następnego bota"** - przełącza na następnego bota i dobiera kartę
5. **Automatyczna kolejność** - boty grają w kolejności 1 → 2 → 3 → 4 → 1
6. **Wspólna talia** - wszyscy boci korzystają z tej samej sekwencji kart

### 💾 Zapisywanie gry

Stan gry można skopiować jako krótki kod i przenieść na inne urządzenie (przycisk "Kopiuj stan gry").

### 🔗 Udostępnianie gry (v0.4.1)

**Obsługiwane formaty:**

- **ZS** - Single-Bot (główny format v0.4.1): `ZS5AC278B6413`
- **ZOO** - Legacy (backward compatibility): `ZOOA0CB5938416274`

**Funkcje v0.4.1:**

1. **Podczas gry** kliknij przycisk **"Kopiuj stan gry"**
2. **Automatic format** - ZS dla 1 bota, ZOO dla multi-bot
3. **Walidacja kodu** w czasie rzeczywistym przy wczytywaniu
4. **Preview stanu** przed załadowaniem (pozycja X/13)
5. **Cross-device compatibility** - kod działa na dowolnym urządzeniu

**Planowane formaty:**

- **ZM** (v0.4.2) - Multi-Shared dla wielu botów
- **ZP** (v0.4.3) - Per-Bot dla niezależnych talii

### 📥 Wczytywanie gry

1. **W menu głównym** kliknij **"📥 Wczytaj grę"**
2. **Wprowadź kod** wygenerowany wcześniej
3. **Preview pokazuje** liczbę botów, aktualnego bota i postęp gry
4. Przycisk aktywny tylko przy prawidłowym kodzie
5. Gra zostanie wczytana w zapisanym stanie

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

- 📚 **[ROADMAP.md](ROADMAP.md)** - Roadmapa rozwoju i przyszłe funkcjonalności
- � **[CHANGELOG.md](CHANGELOG.md)** - Historia zmian i wprowadzonych funkcji
- 🎮 **[GAME-CODES.md](GAME-CODES.md)** - Instrukcja systemu kodów gry

## 🛠️ Technologie

- React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- CSS Modules + React Router DOM 7.8.1

---

**Autor**: Marek Szumny  
**Repo**: [spolka-zoo-bot-pomocnik](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik)  
**Licencja**: MIT
