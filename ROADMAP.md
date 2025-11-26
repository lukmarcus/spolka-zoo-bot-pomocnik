# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki                | Szczegóły techniczne                                                         |
| ------ | ------------ | -------------------------- | ---------------------------------------------------------------------------- |
| 0.5.5  | ✅ Gotowe    | System modułów dodatków    | Checkboxy Ukryte Cele i Intrygi z bonusem monet, ikona monety, alias @images |
| 0.5.6  | 🔮 Planowane | Sekcja zasad gry dla botów | Strona /rules z zasadami specjalnymi, różnice vs gra solo, FAQ               |

## 📋 Szczegółowe plany rozwoju

### v0.5.5 — System modułów dodatków ✅

🎯 Cel: informowanie gracza o bonusach startowych dla botów z modułami

⏱️ Zakończono: 2025-11-24

Zrealizowane zadania:

- **System modułów dodatków** ✅

  - 2 checkboxy w GameSetup: "Ukryte Cele" (+20) i "Intrygi" (+20)
  - Custom checkbox style - wygląd buttonów z widocznym checkboxem
  - Moduły nie wpływają na logikę gry - tylko informacyjne
  - Dynamiczne podsumowanie: "+20/+40 monet dla każdego bota"
  - Ikona monety z `@images/interface/money.png`
  - Integracja z `game.state.modules` - gotowe do przyszłego rozszerzenia
  - Ramka podsumowania łącząca wybór botów, trybu i modułów

- **Code Quality & Infrastructure** ✅

  - Nowy alias `@images` w vite.config.ts
  - Wszystkie importy grafik zamienione na `@images/*`
  - Ujednolicenie stylów ikon - użycie globalnej `.card-icon`
  - Usunięcie duplikacji CSS

**Uwaga**: Zdecydowano o usunięciu modułu "Wydarzenia" (+0 monet) jako nieistotnego.

### v0.5.6 — Sekcja zasad gry dla botów 🔮

🎯 Cel: pomoc graczom w prawidłowym stosowaniu zasad specjalnych dla botów

Planowane zadania:

- **Sekcja zasad specjalnych dla botów** 📖

  - Nowa strona `/rules` dostępna z menu głównego
  - Streszczenie zasad specjalnych przy grze z botami
  - Różnice względem gry solo
  - Najczęstsze błędy i FAQ
  - Konsultacja z autorem gry w sprawie treści

---

## 💡 Status rozwoju

**Aplikacja osiągnęła pełną funkcjonalność w pierwotnej koncepcji** i jest gotowa do rozszerzenia o praktyczne dodatki wspierające rzeczywistą rozgrywkę przy stole.

---
