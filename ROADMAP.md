# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki               | Szczegóły techniczne                                      |
| ------ | ------------ | ------------------------- | --------------------------------------------------------- |
| 0.5.7  | ✅ Gotowe    | Koniec rundy - tasowanie  | Przycisk "Koniec rundy" resetujący i tasujący talie botów |
| 0.6.0  | 🔮 Planowane | Tryb zaawansowany (setup) | Nowy tryb w menu, konfiguracja graczy, kolory             |
| 0.6.1  | 🔮 Planowane | Rundy i fazy              | 5 rund, 3/4 fazy, wyświetlanie stanu gry                  |
| 0.6.2  | 🔮 Planowane | Mechanika końca rundy     | Tasowanie, zmiana pierwszego gracza, potwierdzenia        |
| 0.6.3  | 🔮 Planowane | Punktacja botów           | Licznik pomocników dla botów w trakcie gry                |
| 0.6.4  | 🔮 Planowane | Ekran końcowy             | Podsumowanie punktów, ranking graczy                      |
| 0.6.5  | 🔮 Planowane | Finalizacja trybu         | Usunięcie 🚧, stary tryb jako "Tryb szybki" (opcjonalnie) |

## 📋 Szczegółowe plany rozwoju

### v0.6.0 — Tryb zaawansowany (setup) 🔮

🎯 Cel: wprowadzenie nowego trybu gry z pełną konfiguracją graczy

⚙️ Architektura: Aplikacja to **pomocnik do dobierania kart botów**. Gracze rozgrywają całą swoją grę na planszy, boty wykonują akcje na planszy, aplikacja jedynie wspomaga dobieranie kart.

Planowane zadania:

- **Nowy tryb w menu**

  - Przycisk "Nowa gra (zaawansowana)" z oznaczeniem 🚧 (w budowie)
  - Stary tryb działa bez zmian (przyszły "Tryb szybki")
  - Osobny system zapisów (nie psuje starych kodów!)

- **Ekran konfiguracji graczy**

  - Wybór liczby graczy (2-5): co najmniej jeden gracz + boty, lub tylko boty
  - Wybór koloru żetonu dla każdego gracza/bota: czerwony, żółty, zielony, pomarańczowy, niebieski
  - Kolejność graczy (od lewej do prawej przy stole)

- **Refaktoryzacja GameContext**

  - Dodanie stanu graczy (players[], kolory, isBot)
  - Osobny stan dla trybu zaawansowanego

---

### v0.6.1 — Rundy i fazy 🔮

🎯 Cel: implementacja systemu rund i faz zgodnie z mechaniką gry planszowej

Planowane zadania:

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
