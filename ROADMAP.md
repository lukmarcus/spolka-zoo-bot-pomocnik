# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju 0.4.x - Plany i nadchodzące wydania

| Wersja | Status       | Opis krótki                                                  | Przybliżony termin | Szczegóły techniczne                                                                            |
| ------ | ------------ | ------------------------------------------------------------ | -----------------: | ----------------------------------------------------------------------------------------------- |
| 0.4.2  | ✅ Gotowe    | Implementacja ZM (Multi-Shared)                              |         2025-09-28 | Format wspólnej talii dla wielu botów; zapisywanie/wczytywanie, podgląd i walidacja             |
| 0.4.3  | 🚧 Planowane | Implementacja ZP (Per-Bot)                                   |  ~3-4 dni po 0.4.2 | Format z osobnymi taliami per-bot; parsowanie separatorów `Z`                                   |
| 0.4.x  | ⚠️ Planowane | Kompletny zestaw testów i finalizacja — usunięcie legacy ZOO |  ~2-3 dni po 0.4.3 | Pełny zestaw testów; usunięcie ścieżki odczytu starego formatu ZOO z opisanymi krokami migracji |
| 0.5.0  | 🔮 Planowane | Wizualizacja kart i dopracowanie UI                          |       Do ustalenia | System wizualizacji kart; animacje                                                              |
| 0.6.0+ | 🔮 Planowane | Zaawansowane funkcje                                         |       Do ustalenia | Statystyki, tryby turniejowe, zapisy w chmurze                                                  |

## 📋 Szczegółowe plany rozwoju

### v0.4.2 — Implementacja ZM (Multi-Shared) 🚧

🎯 Cel: wprowadzenie formatu ZM dla kilku botów korzystających ze wspólnej talii

⏱️ Przybliżony termin: ~3-4 dni po v0.4.1

Planowane zadania:

- Implementacja formatu ZM

  - Struktura: `ZM[n_botów][aktualny_bot][obecna_karta][pozostałe_karty...]`
  - Przykład: `ZM325AC278B6413` (3 boty, aktualny=2, obecna=5)
  - Kodowanie/dekodowanie w `src/utils/gameStorage.ts`

- Logika wielobotowa

  - Parsowanie liczby botów (2–4)
  - Walidacja numeru aktualnego bota (1-based)
  - Zarządzanie wspólną talią i synchronizacja stanu

- Wsparcie UI

  - Aktualizacja `LoadGameModal` dla walidacji ZM
  - Logika podglądu dla scenariuszy multi-bot
  - Przyjazne komunikaty błędów specyficzne dla ZM

- Testy
  - Podstawowe testy round-trip (kod ↔ GameState)
  - Edge-case: nieprawidłowa liczba botów, out-of-range current bot

---

### v0.4.3 — Implementacja ZP (Per-Bot) 🚧

🎯 Cel: wprowadzenie formatu ZP, w którym każdy bot ma własną talię

Planowane zadania:

- Implementacja formatu ZP

  - Struktura: `ZP[n_botów][aktualny_bot][obecna_karta]Z[bot1_karty]Z[bot2_karty]...`
  - Przykład: `ZP321Z5Z23Z678`
  - Parsowanie bloków rozdzielonych separatorem `Z`

- Logika per-bot

  - Niezależne sekwencje kart dla każdego bota
  - Algorytm parsowania separatorów `Z`
  - Walidacja międzybotowa (brak duplikatów między taliami, gdzie wymagane)

- UI

  - Pełne wsparcie ZP w `LoadGameModal`
  - Podgląd postępów per-bot
  - Szczegółowe komunikaty walidacyjne dla złożonych przypadków

- Testy
  - Walidacja sekwencji per-bot
  - Sprawdzenie unikalności kart między taliami
  - Scenariusze brzegowe (puste sekwencje, nieprawidłowe separatory)

---

### v0.4.x — Testy kompletne i finalizacja 🚧

🎯 Cel: doprowadzenie projektu do jakości produkcyjnej

⏱️ Przybliżony termin: ~2–3 dni po v0.4.3

Planowane zadania:

- Pełny zestaw testów

  - Testy jednostkowe dla wszystkich formatów (ZS, ZOO, ZM, ZP)
  - Testy round-trip kodów
  - Testy warunków brzegowych i zgodności między formatami

- Optymalizacja i dopracowanie

  - Optymalizacje wydajności dla większej liczby botów
  - Udoskonalenia UI/UX i obsługi błędów

- Dokumentacja końcowa

  - Aktualizacja `GAME-CODES.md`
  - Dokumentacja API dla wszystkich funkcji
  - Przykłady użycia i dobre praktyki
  - Przewodnik migracji: ZOO → ZS/ZM/ZP

- Kontrolowane usunięcie legacy ZOO
  - Usunięcie ścieżki odczytu starego formatu ZOO w kontrolowany sposób
  - Dostarczenie przewodnika migracji i okna kompatybilności (jedno wydanie) dla użytkowników, aby przekonwertowali stare kody

---

## 🔮 Rozwój po 0.4.x

### v0.5.0 — Wizualizacja kart

🎯 Cel: zastąpienie tekstowej reprezentacji kart graficzną wizualizacją

- System projektowania kart (SVG/CSS)
- Ikony i spójny język wizualny
- Animacje: płynne animacje dobierania, animacja odwracania karty, animacja tasowania
- Responsive: adaptacyjne rozmiary, obsługa dotykowa, modal podglądu karty dla małych ekranów

### v0.6.0+ — Funkcje zaawansowane

🎯 Cel: rozszerzenie funkcjonalności dla zaawansowanych użytkowników

- Statystyki gry: historia ruchów, częstotliwość kart, panel analityczny
- Tryby turniejowe i zaawansowane tryby gry (timer, turnieje, tryb treningowy z undo)
- Rozszerzony system zapisu: wiele slotów zapisu, integracja z chmurą, odtwarzanie sesji

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
