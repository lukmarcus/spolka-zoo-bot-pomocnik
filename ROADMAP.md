# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki               | Szczegóły techniczne                                      |
| ------ | ------------ | ------------------------- | --------------------------------------------------------- |
| 0.6.0  | ✅ Gotowe    | Tryb zaawansowany (setup) | Konfiguracja graczy, kolory, tryb gry, moduły             |
| 0.6.1  | ✅ Gotowe    | Rundy i fazy              | 5 rund, 3/4 fazy, modalne akcji, dobieranie kart          |
| 0.6.2  | 🔮 Planowane | Testy                     | Vitest setup, unit testy GameContext                      |
| 0.6.3  | 🔮 Planowane | Koniec gry                | Modal potwierdzenia końca gry, logika ostatniej rundy      |
| 0.6.4  | 🔮 Planowane | Ekran końcowy             | Podsumowanie punktów, ranking graczy                      |
| 0.6.5  | 🔮 Planowane | Punktacja botów           | Licznik pomocników dla botów w trakcie gry                |
| 0.6.6  | 🔮 Planowane | Finalizacja               | Usunięcie 🚧, cleanup kodu, dokumentacja                  |

## 📋 Szczegółowe plany rozwoju

### v0.6.0 — Tryb zaawansowany (setup) ✅

🎯 Cel: wprowadzenie nowego trybu gry z pełną konfiguracją graczy

⚙️ Architektura: Aplikacja to **pomocnik do dobierania kart botów**. Gracze rozgrywają całą swoją grę na planszy, boty wykonują akcje na planszy, aplikacja jedynie wspomaga dobieranie kart.

Zrealizowane:

- **✅ Nowy tryb w menu**

  - Przycisk "Nowa gra (zaawansowana)" z oznaczeniem 🚧 (w budowie)
  - Routing /game-advanced z osobnym komponentem AdvancedGame
  - Stary tryb działa bez zmian (przyszły "Tryb szybki")

- **✅ Ekran konfiguracji graczy**

  - Dynamiczna liczba graczy (2-5): przyciski +/- z walidacją
  - Domyślnie 2 graczy (człowiek + bot)
  - Wybór koloru dla każdego gracza/bota: czerwony, żółty, zielony, pomarańczowy, niebieski
  - Automatyczne zamienianie kolorów przy wyborze zajętego koloru
  - Toggle switch dla każdego gracza: Człowiek/Bot
  - Walidacja: wymagany minimum 1 bot (komunikat ostrzegający)
  - Karty graczy z gradientami, centrowane (max-width: 320px)

- **✅ Wybór trybu gry i modułów**

  - Tryb gry: "Wspólna talia" / "Osobne talie" (tylko jeśli >1 bot)
  - Jeśli 1 bot: wyświetla "Jedna talia" (disabled)
  - Moduły: Ukryte Cele i Intrygi (checkboxy)
  - Podsumowanie konfiguracji z bonusowymi monetami dla botów
  - Style zgodne z ekranem /game (setupStyles)

- **✅ Refaktoryzacja GameContext**

  - Typy rozszerzone: Player, PlayerColor, GameModules
  - Stan lokalny w AdvancedGame (players[], selectedMode, selectedModules)
  - Przycisk "Rozpocznij grę" loguje pełną konfigurację do konsoli

---

### v0.6.1 — Rundy i fazy ✅

🎯 Cel: implementacja systemu rund i faz zgodnie z mechaniką gry planszowej + integracja setupu z GameContext

**Status: GOTOWE** (Jan 18, 2025)

- **✅ Integracja z GameContext**

  - Akcja `START_ADVANCED_GAME` w GameContext
  - Inicjalizacja stanu gry z konfiguracją z v0.6.0
  - Przejście do ekranu gry po kliknięciu "Rozpocznij grę"
  - Auto-inicjalizacja pierwszej karty (index 0) dla trybu individual i shared

- **✅ Mechanika gry**

  - **5 rund** na grę
  - **Fazy w rundzie**: 3 fazy dla >2 osób, 4 fazy dla 2 osób
  - Wyświetlanie: "Runda X/5 • Faza Y/Z" w jednym wierszu

- **✅ Wizualizacja stanu gry**

  - Kwadraty graczy ze statusem aktualnego gracza (border, shadow, scale)
  - Podsumowanie konfiguracji w subtitule (liczba graczy, botów, typ talii)
  - Integracja z Layout component dla spójności visual z resztą app

- **✅ System modalny akcji**

  - Modal potwierdzania dobrania karty
  - Modal potwierdzania dla przejścia (następny gracz/faza/runda/koniec gry)
  - Dynamiczne wiadomości w modalach na podstawie kontekstu
  - Warunkowe renderowanie przycisków w ConfirmModal (2-3 w zależności od props)

- **✅ Centralized modal texts (modalTexts.json)**

  - Wszystkie stringi modalów w jednym miejscu
  - Struktury dla: drawCard, checkBotEffect, instructionModal, beforeFirstRound, nextBot, nextPhase, nextRound, endGame
  - Obsługa wariantów wiadomości (np. single/multiple boty, adjacent/notAdjacent gracze)

- **✅ Modal beforeFirstRound**

  - Pojawia się tylko przed pierwszą rundą (state.currentRound === 1)
  - Wyświetla gracza/graczy przed pierwszym botem
  - Przyciski: "Dalej" i "Wróć do menu"

- **✅ Modal nextBot z listą graczy**

  - Warianty: "adjacent" (bezpośrednio następny) i "notAdjacent" (z graczami pomiędzy)
  - Wyświetla graczy pomiędzy aktualnym a następnym botem
  - Automatyczne dobieranie karty dla nowego bota

- **✅ Modal nextPhase**

  - Zawsze wyświetla: marketPhase ("Rozegraj fazę Rynku dla wszystkich graczy")
  - Opcjonalnie gracze z końca tej fazy
  - Opcjonalnie gracze z następnej fazy
  - Prawidłowe resetowanie do pierwszego bota nowej fazy

- **✅ Modal nextRound**

  - Zmiana gracza startowego (rotation)
  - Tasowanie wszystkich talii botów (individual) lub wspólnej talii (shared)
  - Prawidłowe wskazanie pierwszego bota nowej rundy

- **✅ Logika dobierania kart**

  - Auto-draw przy starcie gry (jeśli nie ma beforeFirstRound)
  - Auto-draw po nextPlayer (NEXT_PLAYER action)
  - Auto-draw po nextPhase (NEXT_PHASE action)
  - Auto-draw po nextRound (NEXT_ROUND action)
  - Prawidłowe obsłanie obu trybów (shared i individual)

- **✅ Naprawa logiki numerowania botów**

  - NEXT_PLAYER: prawidłowe obliczanie numeru bota (nie indeksu gracza)
  - NEXT_PHASE: prawidłowe obliczanie numeru bota dla pierwszego bota nowej fazy
  - NEXT_ROUND: prawidłowe obliczanie numeru bota po rotacji graczy
  - Zaczyna się od bota nr 1, a nie od numeru gracza

- **✅ Refaktoryzacja stylów**

  - Przeniesienie inline stylów do CSS Modules (AdvancedGame.module.css)
  - Klasy: `.infoSection`, `.roundPhaseInfo`, `.playersContainer`, `.playerSquare`, `.playerSquare.active/inactive`, `.playerSquareNumber`
  - Krótsze i bardziej czytelne renderowanie komponentu

---

### v0.6.2 — Testy 🔮

🎯 Cel: pokrycie testami logiki GameContext dla pewności działania skomplikowanej logiki

Planowane zadania:

- **Setup Vitest**

  - Instalacja vitest, @testing-library/react
  - Konfiguracja vitest.config.ts
  - Setup testów dla GameContext reducer

- **Unit testy GameContext**

  - Testy DRAW_CARD (shared i individual mode)
  - Testy NEXT_PLAYER (prawidłowe numerowanie botów)
  - Testy NEXT_PHASE (reset do pierwszego bota)
  - Testy NEXT_ROUND (rotacja graczy, tasowanie, prawidłowy bot)
  - Testy exhausted deck (tasowanie, reshuffle)

- **Test scenarios checklist**

  - Dokumentacja scenariuszy testowych do ręcznego testowania
  - Checklist dla każdego setupu (boty-gracz-boty, shared/individual)

---

### v0.6.3 — Koniec gry 🔮

🎯 Cel: modal potwierdzenia końca gry i przejście do ekranu końcowego

Planowane zadania:

- **Modal końca gry**

  - Pojawia się po 5. rundzie (warunek: `currentRound > 5`)
  - Wiadomość: "Przejść do końca gry?"
  - Przyciski: "Zakończ grę" / "Anuluj"
  - Logika przejścia do `/game-end`

- **Walidacja ostatniej rundy**

  - Obsługa stanu gry po kliknięciu "Zakończ grę"
  - Reset stanu dla nowej gry
  - Powrót do menu przy "Anuluj"

---

### v0.6.4 — Ekran końcowy 🔮

🎯 Cel: ekran podsumowania gry z rankingiem graczy i punktacją

Planowane zadania:

- **Ekran `/game-end`**

  - Podsumowanie dla każdego gracza:
    - Punkty z kart pomocników (dla botów automatycznie)
    - Punkty z monet (każde 5 monet = 1 punkt, po sprzedaży udziałów)
    - **Razem**: suma wszystkich punktów
  - Wpisywanie monet każdego gracza
  - Ranking graczy (1., 2., 3., 4., 5.)
  - Możliwość nowej gry lub powrotu do menu

---

### v0.6.5 — Punktacja botów 🔮

🎯 Cel: śledzenie punktów z pomocników dla botów w trakcie gry

Planowane zadania:

- **Zbieranie punktów botów**

  - Licznik tylko dla **botów**: karty pomocników
  - Automatyczne zliczanie punktów z dobranych kart
  - Wyświetlanie aktualnego stanu punktów w ekranie gry
  - Integracja z ekranem końcowym

---

### v0.6.6 — Finalizacja trybu 🔮

🎯 Cel: zakończenie prac nad trybem zaawansowanym

Planowane zadania:

- **Finalizacja**

  - Usunięcie oznaczenia 🚧 z przycisku
  - Stary tryb zostaje jako "Tryb szybki" (opcjonalnie do decyzji)
  - Cleanup kodu, bugfixy, documentation

---

## 💡 Status rozwoju

**Aplikacja osiągnęła pełną funkcjonalność w pierwotnej koncepcji** i jest gotowa do rozszerzenia o praktyczne dodatki wspierające rzeczywistą rozgrywkę przy stole.

---
