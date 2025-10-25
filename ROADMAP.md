# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki                                    | Szczegóły techniczne                                         |
| ------ | ------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| 0.5.0  | ✅ Gotowe    | Typography & Core Design System                | 3 czcionki, logo, podstawowe style, core CSS variables       |
| 0.5.1  | 🔮 Planowane | Informacje i linki - połączenia z zewnętrznymi | GitHub, bug reports, informacje o grze, linki do wydawnictwa |
| 0.5.2  | 🔮 Planowane | Mobile UX Polish + CSS Refinements             | Mobile padding/spacing, pełny system CSS vars, color cleanup |

## 📋 Szczegółowe plany rozwoju

### v0.5.0 — ⚠️ Typography & Core Design System (w trakcie)

🎯 Cel: implementacja podstawowego systemu typografii i core design

✅ **Ukończone zadania:**

- **System trzech czcionek**

  - ✅ ChillScript.woff2 - dla nagłówków i elementów display
  - ✅ RooneySansBold.woff2 - dla tekstu podstawowego
  - ✅ MarvinRound.woff2 - dla tekstów na kartach botów
  - ✅ CSS Variables: --font-display, --font-body, --font-card

- **Core typography system**

  - ✅ Globalne style h1 z text-shadow i ChillScript
  - ✅ Globalne style h2 z centrowanie i spójnymi marginesami
  - ✅ Globalne style h3, h4 z odpowiednimi czcionkami i kolorami
  - ✅ Podstawowe kolory: #a54617, #6b2e06, #f5c67d

- **Layout foundations**

  - ✅ Logo Spółka ZOO zintegrowane z Layout komponentem
  - ✅ Card-based design dla wszystkich ekranów
  - ✅ Refaktor GameSetup: jedna karta z trzema sekcjami
  - ✅ LoadGame: warunkowo instrukcje vs podgląd
  - ✅ GamePlay: lepsze pozycjonowanie przycisków

- **Finalizacja core typography**
  - ✅ Przyciski: zmiana font-family z inherit na --font-body
  - ✅ Core CSS variables: użycie var(--danger) dla error colors
  - ✅ Kompletny system h1, h2, h3, h4 z odpowiednimi stylami

---

### v0.5.1 — Informacje i linki - połączenia z zewnętrznymi 🔮

🎯 Cel: dodanie informacji o grze i przydatnych linków

⏱️ Przybliżony termin: Do ustalenia

Planowane zadania:

- **Linki zewnętrzne**

  - Odnośnik do repozytorium GitHub
  - Formularz/link do zgłaszania błędów
  - Kontakt z deweloperem

- **Informacje o grze**

  - Sekcja "O grze" z podstawowymi informacjami
  - Linki do wydawnictwa/oficjalnej strony gry
  - Informacje o zasadach (jeśli potrzebne)

- **Kredyty i acknowledgments**
  - Informacje o twórcach aplikacji
  - Ewentualne podziękowania

---

### v0.5.2 — Mobile UX Polish + CSS Refinements 🔮

🎯 Cel: dopracowanie mobile UX i finalizacja systemu design

⏱️ Przybliżony termin: Po v0.5.1

Planowane zadania:

- **Mobile UX Polish** (z oryginalnego planu v0.5.2)

  - **Menu główne**: poprawa wyjustowania przycisków, padding, estetyka na małych ekranach
  - **GameSetup**: ujednolicenie przycisków, lepsze wykorzystanie przestrzeni
  - **GamePlay**: liczniki w jednej linii, optymalizacja układu na mobile
  - Szczegółowe testowanie na różnych ekranach (320px, 768px, 1024px+)

- **CSS System Refinements** (przeniesione z v0.5.0)

  - **Kompletny system CSS Variables**: wszystkie hardcodowane kolory → zmienne
  - **Kolory efektów kart**: system dla zielonych, czerwonych, niebieskich, etc.
  - **System semantic colors**: success, warning, info, danger variables
  - **Spacing system**: zmienne dla wszystkich rozmiarów, shadows, paddings

- **UX Flow Polish**
  - Consistency check wszystkich stanów interfejsu
  - Fine-tuning transitions i micro-interactions
  - Accessibility improvements

---

## � Pomysły na przyszłość - luźny spis ewentualnych usprawnień

Lista potencjalnych funkcjonalności do rozważenia w przyszłych wersjach:

### 🎨 Wizualizacja i UX

- **Graficzna reprezentacja kart** - zastąpienie tekstów obrazkami/ikonami kart
- **Animacje** - płynne animacje dobierania, odwracania, tasowania
- **System projektowania** - spójny język wizualny, ikony, kolory
- **Responsive design** - lepsze dostosowanie do małych ekranów
- **Ciemny motyw** - opcja dark mode dla aplikacji

### 📊 Funkcje zaawansowane

- **Statystyki gry** - historia ruchów, częstotliwość kart, analizy
- **Panel analityczny** - szczegółowe statystyki dla zaawansowanych użytkowników
- **Tryb treningowy** - możliwość cofania ruchów (undo)
- **Timer** - opcjonalny pomiar czasu gry

### 💾 System zapisów

- **Wiele slotów zapisu** - zapisywanie różnych stanów gry
- **Zapisy w chmurze** - synchronizacja między urządzeniami
- **Historia sesji** - możliwość odtwarzania poprzednich gier
- **Eksport/import** - wymiana zapisów między użytkownikami

### 🏆 Tryby rozgrywki

- **Tryby turniejowe** - specjalne zasady dla turniejów
- **Tryb wieloosobowy** - gra przez sieć (daleka przyszłość)
- **Wyzwania** - specjalne scenariusze do rozegrania
  nformacjami

  - Linki do wydawnictwa/oficjalnej strony gry
  - Informacje o zasadach (jeśli potrzebne)

- **Kredyty i acknowledgments**
  - Informacje o twórcach aplikacji
  - Ewentualne podziękowania

---

## � Pomysły na przyszłość - luźny spis ewentualnych usprawnień

Lista potencjalnych funkcjonalności do rozważenia w przyszłych wersjach:

### 🎨 Wizualizacja i UX

- **Graficzna reprezentacja kart** - zastąpienie tekstów obrazkami/ikonami kart
- **Animacje** - płynne animacje dobierania, odwracania, tasowania
- **System projektowania** - spójny język wizualny, ikony, kolory
- **Responsive design** - lepsze dostosowanie do małych ekranów
- **Ciemny motyw** - opcja dark mode dla aplikacji

### 📊 Funkcje zaawansowane

- **Statystyki gry** - historia ruchów, częstotliwość kart, analizy
- **Panel analityczny** - szczegółowe statystyki dla zaawansowanych użytkowników
- **Tryb treningowy** - możliwość cofania ruchów (undo)
- **Timer** - opcjonalny pomiar czasu gry

### 💾 System zapisów

- **Wiele slotów zapisu** - zapisywanie różnych stanów gry
- **Zapisy w chmurze** - synchronizacja między urządzeniami
- **Historia sesji** - możliwość odtwarzania poprzednich gier
- **Eksport/import** - wymiana zapisów między użytkownikami

### 🏆 Tryby rozgrywki

- **Tryby turniejowe** - specjalne zasady dla turniejów
- **Tryb wieloosobowy** - gra przez sieć (daleka przyszłość)
- **Wyzwania** - specjalne scenariusze do rozegrania

## 📖 Dokumentacja techniczna (skrót)

### Aktualna architektura

- Frontend: React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- Style: CSS Modules
- Zarządzanie stanem: React Context + useReducer
- Routing: React Router DOM
- Build: Vite
- Linting: ESLint

### Struktura projektu (skrót)

```
src/
├── components/  # Komponenty React (layout, modalne)
├── pages/       # Strony aplikacji (Home, Game)
├── hooks/       # Własne hooki React
├── context/     # Providery kontekstu gry
├── utils/       # Funkcje pomocnicze
├── types/       # Definicje TypeScript
├── data/        # Dane gry (karty, itp.)
├── styles/      # Style globalne
└── assets/      # Obrazy, ikony, czcionki
```

### Interfejs GameState (skrót)

```typescript
interface GameState {
  currentCardIndex: number; // 0-12, pozycja w talii
  cardSequence: number[]; // 13 kart, permutacja 0-12
  usedCards: number[]; // karty użyte w bieżącej rundzie
  botsSelected?: boolean; // czy wybrano liczbę botów
  botCount?: number; // liczba botów 1-4
  currentBot?: number; // aktualny bot 1-X
}
```

### Główne akcje w GameContext

- `DRAW_CARD` - dobieranie karty
- `SHUFFLE_DECK` - tasowanie talii
- `RESET_GAME` - reset do stanu początkowego
- `NEW_GAME` - nowa gra
- `LOAD_GAME` - wczytywanie stanu gry
- `SELECT_BOTS` - wybór liczby botów
- `NEXT_BOT` - przełączenie na następnego bota
- `NEXT_BOT_AND_DRAW` - przełączenie i dobieranie karty

### System kodów gry (skrót)

- Format przykładowy: `ZS`, `ZM`, `ZP` (remaining-only) oraz historyczne `ZOO`
- Długość: czytelne kody są krótsze i zależą od postępu gry; ZOO ma stałą długość historycznie
- Przykład: `ZS5AC278B6413` (ZS – single-bot)

---

Jeśli chcesz, mogę przygotować: przewodnik migracji (`MIGRATION.md`) z przykładami konwersji starych kodów `ZOO` do nowych formatów, albo utworzyć branch roboczy `feature/zp-parser` ze szkicem parsera i testów.
