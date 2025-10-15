# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki                                     | Szczegóły techniczne                                          |
| ------ | ------------ | ----------------------------------------------- | ------------------------------------------------------------- |
| 0.4.7  | ✅ Gotowe    | UX Fixes vol.2 - dopracowanie interfejsu        | Pełnoekranowy LoadGame, modalne poprawki, usunięcie ostrzeżeń |
| 0.5.0  | 🔮 Planowane | Typography & Visual Polish - czcionki i design  | Własne czcionki, ujednolicenie tekstów, design system         |
| 0.5.1  | 🔮 Planowane | Informacje i linki - połączenia z zewnętrznymi  | GitHub, bug reports, informacje o grze, linki do wydawnictwa  |
| 0.5.2  | 🔮 Planowane | Mobile UX Polish - dopracowanie wersji mobilnej | Padding, justowanie przycisków, layout ekranów mobilnych      |

## 📋 Szczegółowe plany rozwoju

### v0.4.7 — ✅ UX Fixes vol.2 - dopracowanie interfejsu (ukończone)

🎯 Cel: dokończenie poprawek interfejsu użytkownika

✅ **Ukończone zadania:**

- **Pełnoekranowy ekran wczytywania gry**

  - Zastąpienie LoadGameModal pełnym ekranem
  - Lepsza responsywność na wszystkich urządzeniach
  - Przycisk zamknięcia (X) dodany do modalów

- **Poprawki modalów i przycisków**

  - Uproszczenie struktury modalnej (4 pliki → 2 pliki)
  - Trzeci przycisk "Wyjdź bez zapisu" w modalu wyjścia z gry
  - Kolejność przycisków: "Kopiuj stan gry" przed "Wróć do menu"
  - Przyciski w modalach wyrównane do prawej strony

- **Poprawki tekstów i komunikatów**

  - Tekst trybu gry: "1 bot, jedna talia" zamiast "osobne talie"
  - Usunięto niepotrzebny komunikat "⚠️ Talia wyczerpana"

- **Naprawy błędów**
  - Wskaźnik kart pokazuje 1/13 zamiast 2/13 po przetasowaniu
  - Efekt hover na przycisku "Rozpocznij grę"
  - Niewidoczne nagłówki w modalach

---

### v0.5.0 — Typography & Visual Polish - czcionki i design 🔮

🎯 Cel: implementacja własnych czcionek i kompleksowe dopracowanie wizualne

Planowane zadania:

- **System czcionek**

  - Implementacja własnych plików czcionek (nie Google Fonts)
  - Optymalizacja ładowania czcionek
  - Fallback fonts dla compatibility

- **Ujednolicenie stylingu**

  - Konsistentne wielkości tekstów w całej aplikacji
  - Spójny vertical rhythm i spacing
  - Harmonijny system typograficzny

- **Design system**
  - Dokumentacja używanych czcionek i rozmiarów
  - Style guide dla przyszłych zmian

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

### v0.5.2 — Mobile UX Polish - dopracowanie wersji mobilnej 🔮

🎯 Cel: optymalizacja interfejsu dla urządzeń mobilnych

Planowane zadania:

- **Menu główne**

  - Poprawa wyjustowania przycisków
  - Ujednolicenie wielkości liter na przyciskach
  - Dodanie odpowiedniego paddingu dla lepszego wyglądu
  - Ogólna poprawa estetyki na małych ekranach

- **Ekran rozpoczęcia gry (GameSetup)**

  - Ujednolicenie wielkości wszystkich przycisków
  - Dodanie delikatnego paddingu między elementami
  - Zmniejszenie odległości na dole od stopki
  - Lepsze wykorzystanie przestrzeni ekranu

- **Ekran gry (GamePlay)**
  - Umieszczenie licznika kart i botów w jednej linii
  - Ujednolicenie czcionki na wszystkich przyciskach
  - Optymalizacja układu dla lepszej czytelności na mobilnych

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
