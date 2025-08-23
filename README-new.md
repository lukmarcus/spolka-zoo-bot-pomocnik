# Spółka ZOO - Bot Pomocnik

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - cyfrowy zamiennik dla kart botów.

## 🎮 O projekcie

Ta aplikacja zastępuje fizyczne karty botów (13 kart) w grze planszowej Spółka ZOO. Umożliwia grę z botami, zarządzanie ich kartami i losowanie kart z talii.

### Główne funkcje

- 🤖 Losowanie kart botów z talii 13 kart
- 🎲 Tasowanie i dobieranie kolejnych kart
- 🔄 Reset i przetasowanie talii
- 💾 **NOWE**: Zapisywanie i wczytywanie stanu gry (localStorage)
- 🔗 **NOWE**: Kody gry (tylko w tej samej przeglądarce)
- 📱 Responsywny design dla telefonów (320px+)

## 🚀 Status rozwoju

**Aktualna wersja**: 0.2.0 ✅  
**Status**: Save/Load system implemented (localStorage-only)  
**Znane problemy**: Kody nie działają cross-device ⚠️  
**Następna wersja**: 0.2.1 - Cross-device functionality

## 📖 Instrukcja obsługi

### 💾 Zapisywanie gry

Gra **automatycznie zapisuje** się w lokalnej pamięci przeglądarki podczas każdej akcji.

### 🔗 Udostępnianie gry

**⚠️ OGRANICZENIE v0.2.0**: Kody działają tylko w tej samej przeglądarce

1. **Podczas gry** kliknij przycisk **"🔗 Udostępnij grę"**
2. **Skopiuj** wygenerowany kod
3. **Kod działa tylko w tej przeglądarce** - nie można wysłać innemu graczowi

### 📥 Wczytywanie gry

1. **W menu głównym** kliknij **"📥 Wczytaj grę"**
2. **Wprowadź kod** wygenerowany wcześniej **w tej przeglądarce**
3. Gra zostanie wczytana jeśli kod istnieje w pamięci przeglądarki

## 📋 Szybki start

### Instalacja

```bash
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik
npm install
npm run dev
```

### Dostępne komendy

```bash
npm run dev     # Uruchomienie serwera deweloperskiego
npm run build   # Build produkcyjny
npm run lint    # Sprawdzenie linting
npm run preview # Podgląd builda
```

## 🗓️ Plan rozwoju

| Wersja | Status       | Opis                                                      |
| ------ | ------------ | --------------------------------------------------------- |
| 0.2.0  | ✅ Ukończona | **Save/Load system (localStorage-only)** ⚠️ bugfix needed |
| 0.2.1  | 🔜 Planowana | Cross-device kody gry - naprawienie systemu udostępniania |
| 0.2.2  | 🔜 Planowana | UX improvements modali - uproszczenie interfejsu          |
| 0.2.3  | 🔜 Planowana | Optymalizacja długości kodów (custom encoding)            |
| 0.3.0  | 🔜 Planowana | Wsparcie dla wielu botów                                  |
| 0.4.0  | 🔜 Planowana | Osobne talie dla każdego bota                             |
| 0.5.0  | 🔜 Planowana | Wizualizacja kart                                         |

**Szczegóły techniczne**: Zobacz [`DOCS.md`](./DOCS.md)  
**Historia zmian**: Zobacz [`CHANGELOG.md`](./CHANGELOG.md)

## 🛠️ Technologie

- React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- CSS Modules + React Router DOM 7.8.1

---

**Autor**: Marek Szumny  
**Repo**: [spolka-zoo-bot-pomocnik](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik)  
**Licencja**: MIT
