# Spółka ZOO - Bot Pomocnik

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - cyfrowy zamiennik dla kart botów.

## 🎮 O projekcie

Ta aplikacja zastępuje fizyczne karty botów (13 kart) w grze planszowej Spółka ZOO. Umożliwia grę z botami, zarządzanie ich kartami i losowanie kart z talii.

### Główne funkcje

- 🤖 Losowanie kart botów z talii 13 kart
- 🎲 Tasowanie i dobieranie kolejnych kart
- 🔄 Reset i przetasowanie talii
- 💾 Zapisywanie i wczytywanie stanu gry (localStorage)
- 🔗 Udostępnianie gry przez kompaktowe kody (cross-device)
- 🔍 **NOWE**: Live preview stanu gry przed wczytaniem
- ⚡ **NOWE**: Inteligentna walidacja kodów gry w czasie rzeczywistym
- 🤖 **NOWE v0.3.0**: Obsługa wielu botów (2-4) z jedną talią
- 🔄 **NOWE v0.3.0**: Przełączanie między botami podczas gry
- 🔧 **NAPRAWIONO v0.3.1**: Krytyczne błędy UX z v0.3.0 (re-rendery, nawigacja, licznik kart)
- 🎨 **NOWE v0.3.2**: Przeprojektowany interfejs wyboru botów z zoo-tematyczną stylistyką
- ⚡ **NOWE v0.3.2**: Usprawiony flow gry - automatyczne dobranie pierwszej karty po wyborze botów
- �️ **NAPRAWIONO v0.3.2**: Błąd pustego ekranu po odświeżeniu strony
- 🎮 **NOWE v0.3.3**: Automatyczna kolejność botów - usunięto manual przełączniki
- 🎯 **NOWE v0.3.3**: Dwa inteligentne przyciski akcji zgodnie z zasadami planszówki
- �📱 Responsywny design dla telefonów (320px+)

## 🚀 Status rozwoju

**Aktualna wersja**: 0.3.3 ✅  
**Status**: Enhanced Game Mechanics - automatyczna kolejność botów i intuicyjna mechanika gry  
**Poprzednie wersje**:

- 0.3.2 - Major UX Update - przeprojektowany interfejs i zoo-tematyczna stylistyka
- 0.3.1 - Hotfix dla krytycznych błędów v0.3.0
- 0.3.0 - Multi-bot support (miał problemy z re-renderami)

## 📖 Instrukcja obsługi

### 🤖 Gra z wieloma botami (v0.3.3+)

1. **Rozpocznij grę** - kliknij "Rozpocznij grę"
2. **Wybierz liczbę botów** - wybierz od 1 do 4 botów używając stylizowanych przycisków
3. **Automatyczna gra** - gra automatycznie dobiera pierwszą kartę po wyborze botów
4. **Dwa inteligentne przyciski**:
   - **"🎯 Dobierz następną kartę dla bota X"** - dobiera kartę dla aktualnego bota
   - **"👥 Dobierz kartę dla następnego bota"** - przełącza na następnego bota i dobiera kartę
5. **Automatyczna kolejność** - boty grają w kolejności 1 → 2 → 3 → 4 → 1
6. **Wspólna talia** - wszyscy boci korzystają z tej samej sekwencji kart

### 💾 Zapisywanie gry

Gra **automatycznie zapisuje** się w lokalnej pamięci przeglądarki podczas każdej akcji.

### 🔗 Udostępnianie gry

Kody gry są zawsze generowane wielkimi literami (ZOO + 0-9, A-C) i można je przesyłać między urządzeniami.

1. **Podczas gry** kliknij przycisk **"Kopiuj stan gry"**
2. **Kod jest automatycznie skopiowany** do schowka (np. `ZOOA0CB5938416274`)
3. Kod działa na dowolnym urządzeniu i przeglądarce

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
