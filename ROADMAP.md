# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju 0.4.x - Plany i nadchodzące wydania

| Wersja | Status       | Opis krótki                                       | Przybliżony termin | Szczegóły techniczne                                                                     |
| ------ | ------------ | ------------------------------------------------- | -----------------: | ---------------------------------------------------------------------------------------- |
| 0.4.3  | ✅ Gotowe    | Implementacja ZP (Per-Bot)                        |         2025-10-04 | Format z osobnymi taliami per-bot; parsowanie separatorów `Z`, pełna walidacja i preview |
| 0.4.4  | ⚠️ Planowane | Wycofanie legacy formatu ZOO i finalizacja testów |      ~1-2 tygodnie | Usunięcie obsługi ZOO, przewodnik migracji, comprehensive testing suite                  |
| 0.5.0  | 🔮 Planowane | Wizualizacja kart i dopracowanie UI               |       Do ustalenia | System wizualizacji kart; animacje                                                       |
| 0.6.0+ | 🔮 Planowane | Zaawansowane funkcje                              |       Do ustalenia | Statystyki, tryby turniejowe, zapisy w chmurze                                           |

## 📋 Szczegółowe plany rozwoju

### v0.4.4 — Wycofanie legacy ZOO i finalizacja testów 🚧

🎯 Cel: usunięcie przestarzałego formatu ZOO i doprowadzenie projektu do jakości produkcyjnej

⏱️ Przybliżony termin: ~1-2 tygodnie po v0.4.3

Planowane zadania:

- **Wycofanie legacy formatu ZOO**

  - Usunięcie obsługi odczytu starych kodów ZOO z `loadFromShareableCode()`
  - Usunięcie funkcji `decodeLegacyZooPayload()` i powiązanych funkcji
  - Aktualizacja `isValidGameCode()` - brak wsparcia dla ZOO
  - Czytelne komunikaty błędów dla starych kodów ZOO z instrukcją migracji

- **Przewodnik migracji ZOO → ZS/ZM/ZP**

  - Dokumentacja procesu migracji starych kodów
  - Narzędzie konwersji (opcjonalnie) - ZOO → odpowiedni nowoczesny format
  - Instrukcje dla użytkowników z starymi zapisanymi kodami
  - Komunikaty w UI kierujące do przewodnika migracji

- **Comprehensive testing suite**

  - Testy jednostkowe dla wszystkich formatów (ZS, ZM, ZP)
  - Testy round-trip: encode → decode → verify
  - Testy warunków brzegowych i edge cases
  - Performance tests dla większej liczby botów

- **Finalizacja dokumentacji**

  - Aktualizacja `GAME-CODES.md` - usunięcie sekcji ZOO
  - Dokumentacja API dla wszystkich funkcji eksportowanych
  - Przykłady użycia i best practices
  - Cleanup kodu - usunięcie martwych ścieżek i legacy komentarzy

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
