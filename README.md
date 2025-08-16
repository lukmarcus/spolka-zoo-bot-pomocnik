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

**Aktualny status**: 🔧 W planowaniu
**Aktualna wersja**: 0.0.0 (przed pierwszym commitem)
**Następna wersja**: 0.0.1 - Setup projektu

## 📋 Szybki start

### Wymagania

- Node.js 18+
- npm/yarn/pnpm

### Instalacja (po stworzeniu projektu)

```bash
# Klonowanie repo
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik

# Instalacja zależności
npm install

# Uruchomienie dev server
npm run dev
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

- **Frontend**: React + TypeScript + Vite
- **Style**: CSS Modules
- **State**: React Context + useReducer
- **PWA**: Service Worker + Web App Manifest
- **Build**: Vite
- **Tests**: Jest + React Testing Library

## 🗓️ Plan rozwoju

| Wersja | Status       | Opis                                        |
| ------ | ------------ | ------------------------------------------- |
| 0.0.1  | 🔜 Planowana | Setup projektu i podstawowa nawigacja       |
| 0.1.0  | 🔜 Planowana | Podstawowa mechanika bota (1 bot, 13 kart)  |
| 0.2.0  | 🔜 Planowana | Zapis i wczytywanie gry                     |
| 0.3.0  | 🔜 Planowana | Wiele botów na jednej talii                 |
| 0.4.0  | 🔜 Planowana | Osobne talie dla każdego bota               |
| 0.5.0  | 🔜 Planowana | Wizualizacja kart                           |
| ...    |              | Zobacz [DOKUMENTACJA.md](./DOKUMENTACJA.md) |

## 🤝 Rozwój

### Workflow

1. Każda nowa funkcja = nowy branch z `main`
2. Commit messages po polsku
3. Pull request do `main` po zakończeniu funkcji
4. Dokumentacja aktualizowana z każdą wersją

### Struktura commitów

```
feat: dodanie ekranu gry dla jednego bota
fix: poprawka kodowania stanu gry
docs: aktualizacja dokumentacji wersji 0.1.0
style: poprawa responsywności dla telefonów
```

## 📄 Licencja

MIT License - projekt open source

## 🎲 O grze Spółka ZOO

Spółka ZOO to gra planszowa, w której gracze zarządzają ogrodami zoologicznymi. Boty w grze to sztuczni gracze sterowani przez talię 13 kart, które określają ich akcje w każdej turze.

---

**Autor**: lukmarcus  
**Repo**: [spolka-zoo-bot-pomocnik](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik)  
**Język**: Polski
