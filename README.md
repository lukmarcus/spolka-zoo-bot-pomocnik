# Spółka ZOO - Bot Pomocnik

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - cyfrowy zamiennik dla kart botów.

## 🎮 O projekcie

Ta aplikacja zastępuje fizyczne karty botów (13 kart) w grze planszowej Spółka ZOO. Umożliwia grę z 1-4 botami, zarządzanie ich kartami i zapisywanie stanu gry.

### Główne funkcje

- 🤖 Zarządzanie botami (1-4 sztuki)
- 🃏 Symulacja talii 13 kart dla każdego bota
- 💾 Zapisywanie i wczytywanie stanu gry
- 📱 Responsywny design dla telefonów
- 🎯 Licznik punktów graczy
- 📊 Historia użytych kart

## 🚀 Status rozwoju

**Aktualna wersja**: 0.0.3 ✅  
**Status**: Responsywność WCAG ukończona  
**Następna wersja**: 0.1.0 - Mechanika kart botów

## 📋 Szybki start

### Wymagania

- Node.js 18+
- npm/yarn/pnpm

### Instalacja

```bash
# Klonowanie repo
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik

# Instalacja zależności
npm install

# Uruchomienie dev server
npm run dev
```

### Dostępne komendy

```bash
npm run dev     # Uruchomienie serwera deweloperskiego
npm run build   # Build produkcyjny
npm run lint    # Sprawdzenie linting
npm run preview # Podgląd builda
```

## 📖 Dokumentacja

Pełna dokumentacja projektu znajduje się w pliku [`DOKUMENTACJA.md`](./DOKUMENTACJA.md).

Zawiera:

- 🎯 Plan rozwoju (wersje 0.0.1 → 1.0.0)
- 🔧 Szczegóły techniczne
- 📝 Lista funkcjonalności
- 🗂️ Struktura projektu
- 🃏 Definicje kart botów

## 🛠️ Technologie

- **Frontend**: React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- **Style**: CSS Modules
- **Routing**: React Router DOM 7.8.1
- **Build**: Vite
- **Linting**: ESLint

## 🗓️ Plan rozwoju

| Wersja | Status       | Opis                                        |
| ------ | ------------ | ------------------------------------------- |
| 0.0.1  | ✅ Ukończona | Setup projektu i podstawowa nawigacja       |
| 0.0.2  | ✅ Ukończona | Poprawki wizualne i responsywności          |
| 0.0.3  | ✅ Ukończona | WCAG 320px compliance, CSS refactoring      |
| 0.1.0  | 🔜 Planowana | Podstawowa mechanika bota (1 bot, 13 kart)  |
| 0.2.0  | 🔜 Planowana | Zapis i wczytywanie gry                     |
| 0.3.0  | 🔜 Planowana | Wiele botów na jednej talii                 |
| 0.4.0  | 🔜 Planowana | Osobne talie dla każdego bota               |
| 0.5.0  | 🔜 Planowana | Wizualizacja kart                           |
| ...    |              | Zobacz [DOKUMENTACJA.md](./DOKUMENTACJA.md) |

## 🎨 Wygląd aplikacji

Aplikacja wykorzystuje kolory z instrukcji gry:

- 🟢 Żółto-zielone tło gradientowe
- 🟤 Brązowe nagłówki i przyciski
- 🟡 Kremowe tło kart z pomarańczowo-brązowymi ramkami
- 📱 Design mobile-first (portrait mode)

## 🤝 Rozwój

### Workflow

1. Każda nowa funkcja = nowy branch z `main`
2. Commit messages po angielsku
3. Pull request do `main` po zakończeniu funkcji
4. Dokumentacja aktualizowana z każdą wersją

### Struktura projektu

```
src/
├── components/         # Komponenty React (Layout, etc.)
├── pages/             # Strony aplikacji (Home, Game)
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── utils/             # Funkcje pomocnicze
├── types/             # TypeScript definitions
├── data/              # Dane gry (karty, etc.)
├── styles/            # Globalne style CSS
└── assets/            # Obrazy, ikony, czcionki
```

## 📄 Licencja

MIT License - projekt open source

---

**Autor**: Marek Szumny  
**Repo**: [spolka-zoo-bot-pomocnik](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik)  
**Język**: Polski
