# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki               | Szczegóły techniczne                                      |
| ------ | ------------ | ------------------------- | --------------------------------------------------------- |
| 0.6.0  | ✅ Gotowe    | Tryb zaawansowany (setup) | Konfiguracja graczy, kolory, tryb gry, moduły             |
| 0.6.1  | 🔮 Planowane | Rundy i fazy              | 5 rund, 3/4 fazy, wyświetlanie stanu gry                  |
| 0.6.2  | 🔮 Planowane | Mechanika końca rundy     | Tasowanie, zmiana pierwszego gracza, potwierdzenia        |
| 0.6.3  | 🔮 Planowane | Punktacja botów           | Licznik pomocników dla botów w trakcie gry                |
| 0.6.4  | 🔮 Planowane | Ekran końcowy             | Podsumowanie punktów, ranking graczy                      |
| 0.6.5  | 🔮 Planowane | Finalizacja trybu         | Usunięcie 🚧, stary tryb jako "Tryb szybki" (opcjonalnie) |

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

### v0.6.1 — Rundy i fazy 🔮

🎯 Cel: implementacja systemu rund i faz zgodnie z mechaniką gry planszowej + integracja setupu z GameContext

Planowane zadania:

- **Integracja z GameContext**

  - Akcja START_ADVANCED_GAME w GameContext
  - Inicjalizacja stanu gry z konfiguracją z v0.6.0
  - Przejście do ekranu gry po kliknięciu "Rozpocznij grę"

- **Mechanika gry**

  - **5 rund** na grę
  - **Fazy w rundzie**: 4 fazy dla 2 osób, 3 fazy dla >2 osób
  - Wyświetlanie: Runda X/5, Faza Y, Gracz: [kolor]

- **Zmiana gracza**

  - Przejście do następnego gracza z potwierdzeniem modalem
  - Wizualne rozróżnienie graczy po kolorach żetonów

---

### v0.6.2 — Mechanika końca rundy 🔮

🎯 Cel: prawidłowa obsługa końca rundy z tasowaniem i zmianą gracza

Planowane zadania:

- **Koniec rundy**

  - Tasowanie tali botów po każdej rundzie
  - Zmiana pierwszego gracza (potwierdzenie modalem)
  - Automatyczne przejście do nowej rundy

- **Modalne potwierdzenia i informacje**

  - Modal "Koniec fazy" - informacja o resecie do pierwszego bota
  - Modal "Koniec rundy" - informacja o tasowaniu i zmianie gracza startowego
  - Modal "Koniec gry" - podsumowanie rozgrywki, powrót do menu

---

### v0.6.3 — Punktacja botów 🔮

🎯 Cel: śledzenie punktów z pomocników dla botów w trakcie gry

Planowane zadania:

- **Zbieranie punktów w trakcie gry**

  - Licznik tylko dla **botów**: karty pomocników
  - Automatyczne zliczanie punktów z dobranych kart
  - Gracze sami śledzą monety, pomocników i udziały na planszy

---

### v0.6.4 — Ekran końcowy 🔮

🎯 Cel: podsumowanie gry z rankingiem graczy

Planowane zadania:

- **Ekran końcowy**

  - Podsumowanie dla każdego gracza:
    - Punkty z kart pomocników (dla botów automatycznie)
    - Punkty z monet (każde 5 monet = 1 punkt, po sprzedaży udziałów)
    - **Razem**: suma wszystkich punktów
  - Wpisywanie monet każdego gracza
  - Ranking graczy (1., 2., 3., 4., 5.)
  - Możliwość nowej gry lub powrotu do menu

---

### v0.6.5 — Finalizacja trybu 🔮

🎯 Cel: zakończenie prac nad trybem zaawansowanym

Planowane zadania:

- **Finalizacja**

  - Usunięcie oznaczenia 🚧 z przycisku
  - Stary tryb zostaje jako "Tryb szybki" (opcjonalnie do decyzji)
  - Cleanup kodu, testy, bugfixy

---

## 💡 Status rozwoju

**Aplikacja osiągnęła pełną funkcjonalność w pierwotnej koncepcji** i jest gotowa do rozszerzenia o praktyczne dodatki wspierające rzeczywistą rozgrywkę przy stole.

---
