# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki                | Szczegóły techniczne                                                     |
| ------ | ------------ | -------------------------- | ------------------------------------------------------------------------ |
| 0.5.6  | ✅ Gotowe    | Sekcja zasad gry dla botów | Strona /rules z zasadami specjalnymi, refaktoryzacja komponentów, aliasy |
| 0.5.7  | 🔮 Planowane | Koniec rundy - tasowanie   | Przycisk "Koniec rundy" resetujący i tasujący talie botów                |

## 📋 Szczegółowe plany rozwoju

### v0.5.6 — Sekcja zasad gry dla botów ✅

🎯 Cel: pomoc graczom w prawidłowym stosowaniu zasad specjalnych dla botów

⏱️ Zakończono: 2025-12-06

Zrealizowane zadania:

- **Sekcja zasad specjalnych dla botów** ✅

  - Nowa strona `/rules` dostępna z menu głównego
  - 6 sekcji zasad: Bot jako gracz, Talia i tura, Wybory, Pomocnicy, Moduły dodatkowe, Organizacja
  - Custom styling list (list-style-position: outside, optymalne marginesy)
  - Komponenty Rules.tsx + Rules.module.css

- **Refaktoryzacja i Code Quality** ✅

  - Nowy komponent BottomControls (unifikacja przycisków powrotu)
  - Obsługa opcjonalnego przycisku "Kopiuj stan gry" w BottomControls
  - Zamiana wszystkich względnych importów na aliasy @ui, @game, @lib
  - Konsekwentne użycie aliasów także dla CSS Modules
  - Usunięcie zbytecznego komponentu BackButton

### v0.5.7 — Koniec rundy - tasowanie tali 🔮

🎯 Cel: poprawna implementacja mechaniki tasowania tali botów po rundzie

**Problem**: Obecnie talie botów są tasowane dopiero po wyczerpaniu wszystkich kart. Według zasad gry powinny być tasowane na koniec każdej rundy.

Planowane zadania:

- **Mechanika końca rundy** 🔄

  - Nowy przycisk "Koniec rundy" w GamePlay
  - Przycisk resetuje `currentCardIndex` dla wszystkich tali botów
  - Tasowanie wszystkich tali botów (zarówno w trybie individual, jak i shared)
  - Wizualna informacja o wykonanym tasowaniu
  - Opcjonalne potwierdzenie akcji (modal), aby uniknąć przypadkowego kliknięcia

- **Aktualizacja stanu gry** 🎮

  - Dodanie metody `endRound()` w GameContext
  - Aktualizacja logiki tasowania - oddzielenie tasowania rundy od tasowania wyczerpania
  - Zapisywanie informacji o zakończonych rundach w stanie gry (opcjonalnie)

---

## 💡 Status rozwoju

**Aplikacja osiągnęła pełną funkcjonalność w pierwotnej koncepcji** i jest gotowa do rozszerzenia o praktyczne dodatki wspierające rzeczywistą rozgrywkę przy stole.

---
