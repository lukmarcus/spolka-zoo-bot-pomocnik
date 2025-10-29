# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki                                    | Szczegóły techniczne                                         |
| ------ | ------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| 0.5.1  | ✅ Gotowe    | Informacje i linki - połączenia z zewnętrznymi | GitHub, bug reports, informacje o grze, linki do wydawnictwa |
| 0.5.2  | 🔮 Planowane | Ekran ładowania kodu - poprawki                | Poprawki UX/validation/podpowiedzi przy wczytywaniu kodu     |
| 0.5.3  | 🔮 Planowane | Mobile UX Polish + CSS Refinements             | Mobile padding/spacing, pełny system CSS vars, color cleanup |

## 📋 Szczegółowe plany rozwoju

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

### v0.5.2 — Ekran ładowania kodu (Loading screen) 🔧

🎯 Cel: poprawić UX i walidację przy wczytywaniu kodów gry

⏱️ Przybliżony termin: Po v0.5.1

Planowane zadania:

- **Walidacja i komunikaty**

  - Lepsze walidowanie formatu kodu przed próbą wczytania
  - Jasne komunikaty błędów i wskazówki naprawy (np. niepoprawna długość, nieznane tokeny)
  - Feedback dla użytkownika (loading spinner → stan sukcesu/błąd)

- **UX dla ekranu wczytywania**

  - Zoptymalizowane rozmieszczenie elementów: pole wprowadzania, podgląd, przyciski akcji
  - Podpowiedzi kontekstowe i przykładowy kod obok pola
  - Przycisk "Wczytaj" dezaktywowany do momentu przejścia podstawowej walidacji

- **Obsługa błędów i przywracanie stanu**

  - Bezpieczne zachowanie przy błędach parsowania (nie tracimy bieżącej gry)
  - Opcja podglądu zmian przed zatwierdzeniem wczytania
  - Lepsze testy jednostkowe i e2e dla parsera kodów

- **Drobne poprawki wizualne**

  - Animacja spinnera i mikro-interakcje (przejścia przy błędzie/sukcesie)
  - Ujednolicenie przycisków używając `.btn-secondary` gdzie pasuje

---

### v0.5.3 — Mobile UX Polish + CSS Refinements 🔮

🎯 Cel: dopracowanie mobile UX i finalizacja systemu design

⏱️ Przybliżony termin: Po v0.5.2

Planowane zadania:

- **Mobile UX Polish** (z oryginalnego planu v0.5.2)

  - **Menu główne**: poprawa wyjustowania przycisków, padding, estetyka na małych ekranach
  - **GameSetup**: ujednolicenie przycisków, lepsze wykorzystanie przestrzeni
  - **GamePlay**: liczniki w jednej linii, optymalizacja układu na mobile
  - Szczegółowe testowanie na różnych ekranach (320px, 768px, 1024px+)

-- **CSS System Refinements**

- **Kompletny system CSS Variables**: wszystkie hardcodowane kolory → zmienne
- **Kolory efektów kart**: system dla zielonych, czerwonych, niebieskich, etc.
- **System semantic colors**: success, warning, info, danger variables
- **Spacing system**: zmienne dla wszystkich rozmiarów, shadows, paddings

- **UX Flow Polish**
  - Consistency check wszystkich stanów interfejsu
  - Fine-tuning transitions i micro-interactions
  - Accessibility improvements

---

## 💡 Pomysły na przyszłość - luźny spis ewentualnych usprawnień

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

### 🔁 Kredyty i acknowledgments

- Informacje o twórcach aplikacji
- Ewentualne podziękowania

---

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
