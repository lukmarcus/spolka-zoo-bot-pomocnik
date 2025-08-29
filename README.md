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
- 📱 Responsywny design dla telefonów (320px+)

## 🚀 Status rozwoju

**Aktualna wersja**: 0.2.4 ✅  
**Status**: Poprawki UI/UX - uproszczony modal wyjścia, lepsze animacje toasta  
**Następna wersja**: 0.3.0 - Obsługa wielu botów (2-4)

## 📖 Instrukcja obsługi

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
