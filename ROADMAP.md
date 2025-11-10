# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju

| Wersja | Status       | Opis krótki                    | Szczegóły techniczne                                              |
| ------ | ------------ | ------------------------------ | ----------------------------------------------------------------- |
| 0.5.3  | ✅ Gotowe    | Code cleanup + Modal UX        | Czyszczenie kodu, unifikacja CSS, lepszy modal i kopiowanie       |
| 0.5.4  | 🔮 Planowane | Mobile UX + Design System      | Mobile UX, wygląd kart/przycisków, system CSS vars, color cleanup |

## 📋 Szczegółowe plany rozwoju

### v0.5.3 — Code cleanup + Modal UX improvements ✅

🎯 Cel: oczyszczenie kodu i poprawa UX kopiowania stanu gry

⏱️ Zakończono: 2025-11-09

Zrealizowane zadania:

- **Czyszczenie martwego kodu**

  - Usunięto nieużywany `BotCard.tsx` i `BotCard.module.css` (~60 linii)
  - Usunięto nieużywane obrazki: `card-reverse.jpg`, `image*.png` (6 plików)
  - Oczyszczono `globals.css` z nieużywanych styli (~30 linii)
  - **Łącznie usunięto ~160 linii martwego kodu**

- **Refaktoring struktury DOM**

  - Unifikacja CSS classes - wszystkie komponenty używają globalnego `.card`
  - Usunięcie 8+ niepotrzebnych wrapper divów (menuButtonContent, footerText, etc.)
  - Uporządkowanie semantycznej struktury HTML5 z `<section className="section">`
  - Przeniesienie logo do `<header>` dla lepszej semantyki

- **Ulepszenie ConfirmModal**

  - Uproszczenie z 3 różnych layoutów do 1 prostego (3 przyciski poziomo)
  - Usunięcie niepotrzebnych boolean'ów i warunków (skrócenie o ~80 linii)
  - Dynamiczne wiadomości z kolorowym statusem kopiowania
  - Środkowy przycisk szerszy (flex: 1.5) dla lepszego UX

- **Poprawa UX kopiowania stanu gry**
  - Modal z real-time feedback: "Pamiętaj..." → "✅ Skopiowano!" / "❌ Błąd!"
  - Przycisk "Kopiuj kod" tylko kopiuje (nie zamyka modala)
  - Przycisk w grze: "💾 Kopiuj stan gry" → "✅ Skopiowano!" → auto-reset (2.5s)
  - Zastąpienie toast'ów bardziej intuicyjnym systemem w miejscu akcji

- **Optymalizacja interfejsu gry**
  - Licznik kart przeniesiony do nagłówka "AKTUALNA KARTA (1/13)"
  - Numeracja botów w przyciskach: "Dla tego bota (1/4)", "Dla następnego bota (2/4)"
  - Usunięto sekcję statusu - informacje przeniesione bezpośrednio do przycisków
  - Ukryto nagłówek "DOBIERZ KARTĘ" dla jednego bota (zachowano spacing)
  - Poprawiono strukturę sekcji w GameSetup (każda część w osobnej sekcji)
  - Usunięto dolną ramkę z gameControls dla płynniejszego przejścia

---

### v0.5.4 — Mobile UX Polish + CSS Refinements 🔮

🎯 Cel: dopracowanie mobile UX i finalizacja systemu designu

⏱️ Przybliżony termin: Po v0.5.3

Planowane zadania:

- **Mobile UX Polish** (z oryginalnego planu v0.5.2)

  - **Menu główne**: poprawa wyjustowania przycisków, padding, estetyka na małych ekranach
  - **GameSetup**: ujednolicenie przycisków, lepsze wykorzystanie przestrzeni
  - **GamePlay**: liczniki w jednej linii, optymalizacja układu na mobile
  - Szczegółowe testowanie na różnych ekranach (320px, 768px, 1024px+)

- **Poprawa ekranu gry**
  - **Wygląd zawartości kart**: lepsze formatowanie opisów, kolorowanie fraz kluczowych
  - **Stylowanie przycisków**: ujednolicenie designu przycisków akcji w grze
  - **Responsywność kart**: optymalizacja wyświetlania kart na różnych ekranach

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
