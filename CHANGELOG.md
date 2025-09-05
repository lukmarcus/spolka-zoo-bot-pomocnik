# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
projekt stosuje [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2025-09-04

### 🎮 Ulepszenia mechaniki gry zgodnie z planszówką

- **🚫 Usunięto manual przełącznik botów**

  - Usunięto przyciski przełączania botów (1, 2, 3, 4) z interfejsu gry
  - Zastąpiono prostym wskaźnikiem "Aktualny bot: X/Y"
  - Boty grają teraz w automatycznej kolejności

- **🎯 Nowa logika akcji - dwa inteligentne przyciski**

  - **"🎯 Dobierz następną kartę dla bota X"** - dobiera kartę dla bieżącego bota
  - **"👥 Dobierz kartę dla następnego bota"** - przełącza na następnego bota i dobiera kartę
  - Przyciski dostosowują się do liczby botów (1 bot = 1 przycisk, 2+ boty = 2 przyciski)

- **🔀 Kompletna obsługa wyczerpania talii**

  - Przy wyczerpaniu talii: dwa przyciski przetasowania
  - **"🔀 Przetasuj i dobierz kartę dla bota X"** - przetasowuje dla aktualnego bota
  - **"👥 Przetasuj i dobierz dla następnego bota"** - przełącza bota i przetasowuje

### 🏗️ Zmiany techniczne

- **⚡ Nowe akcje w GameContext**

  - `NEXT_BOT` - przełącza na następnego bota w kolejności
  - `NEXT_BOT_AND_DRAW` - przełącza na następnego bota i dobiera kartę
  - Automatyczna kolejność: 1 → 2 → 3 → 4 → 1 (w zależności od liczby botów)

- **🎨 Zaktualizowane style CSS**

  - `.gameControls` wspiera responsywny layout dwóch przycisków
  - Dodano `gap` i `flex-wrap` dla lepszej responsywności
  - Usunięto nieużywane style `.botSwitcher` i `.botButton`

- **🧹 Refaktory kodu**
  - Oczyszczono komentowany kod z Game.tsx i GameContext.tsx
  - Wyodrębniono funkcję `handleShuffleForNextBot`
  - Zaktualizowano wersję aplikacji do 0.3.3

### 📝 Status

**v0.3.3** to kompletne usprawnienie mechaniki gry eliminujące mylące manual przełączniki i wprowadzające intuicyjne, automatyczne zarządzanie kolejnością botów zgodnie z zasadami planszówki.

## [0.3.2] - 2025-09-03

### 🎨 Kompleksowe ulepszenia UX

- **🤖 Nowy interfejs wyboru botów**

  - Przeprojektowany interfejs wyboru liczby botów z lepszą wizualizacją
  - Dodano buttons w stylu kart z zoo-tematyczną paletą kolorów
  - Wyeliminowano mylący ekran pośredni "Gotowy do rozpoczęcia gry"
  - Gra automatycznie dobiera pierwszą kartę po wyborze botów

- **🎮 Usprawnienia flow gry**

  - Usunięto niepotrzebny ekran "Dobierz pierwszą kartę"
  - Zintegrowany interfejs: wybór botów → automatyczne dobranie karty → gra
  - Naprawiono błąd pustego ekranu po odświeżeniu strony
  - Uproszczono logikę renderowania kondycjonalnego

- **🎨 Redesign stylistyczny**

  - Implementacja zoo-tematycznej palety kolorów (brązy, kremowe, pomarańczowe)
  - Stylizacja przycisków wyboru botów w stylu kart
  - Dodano gradienty i efekty hover dla lepszego feedbacku wizualnego
  - Usunięto problematyczne tło kart z interfejsu wyboru (na życzenie użytkownika)

- **🔧 Naprawienie błędów edge case**
  - Naprawiono problem z pustym ekranem po odświeżeniu strony w trakcie wyboru botów
  - Uproszczono warunki renderowania: zawsze pokazuj interfejs wyboru gdy `currentCardIndex === -1`
  - Poprawiono konsystentność zachowania aplikacji

### 🏗️ Zmiany techniczne

- **⚡ Optymalizacja renderowania**

  - Uproszczono logikę kondycjonalną w Game.tsx
  - Wyeliminowano skomplikowane zagnieżdżone warunki
  - Stabilne zachowanie po odświeżeniu strony

- **🎨 Modularyzacja CSS**
  - Dodano nowe klasy CSS dla interfejsu wyboru botów
  - Implementacja zoo-tematycznych kolorów w CSS Modules
  - Responsywny design dla przycisków wyboru

### 📝 Status

**v0.3.2** to znaczące ulepszenie UX eliminujące mylące ekrany pośrednie i wprowadzające spójną, zoo-tematyczną stylistykę z płynnym flow gry.

## [0.3.1] - 2025-09-02

### 🐛 Krytyczne poprawki UX v0.3.0

- **🔄 Naprawiono nieskończone re-rendery**

  - Rozwiązano błąd "Maximum update depth exceeded"
  - Zmemorizowano `contextValue` w GameContext używając `useMemo`
  - Usunięto problematyczne `useEffect` dependencies w Game.tsx
  - Tymczasowo wyłączono auto-save aby zapobiec cyklom re-renderowania

- **🎮 Naprawiono flow gry**

  - Przyciski powrotu do menu głównego działają poprawnie
  - Przejście z menu wyboru botów do menu głównego
  - Przejście z trwającej gry do menu głównego

- **📊 Poprawiono wyświetlanie licznika kart**

  - Licznik jest ukryty w menu wyboru botów
  - Licznik jest ukryty na ekranie "Dobierz pierwszą kartę"
  - Licznik pojawia się dopiero po dobraniu pierwszej karty (1/13, 2/13, itd.)

- **🎛️ Usunięto przycisk "Ustawienia"**
  - Przycisk "Ustawienia" usunięty z menu głównego (zgodnie z planem UX)
  - Menu główne ma teraz tylko 2 opcje: "Rozpocznij grę" i "Wczytaj grę"

### 🏗️ Zmiany techniczne

- **⚡ Optymalizacja GameContext**

  - Dodano `useMemo` dla stabilnych referencji funkcji
  - Poprawiono `getInitialState()` - prawidłowe ustawienie `botsSelected: false`
  - Tymczasowo wyłączono auto-save dla stabilności

- **🔧 Cleanup niepotrzebnych importów**
  - Usunięto nieużywane `useEffect` z Game.tsx
  - Oczyszczono imports w GameContext.tsx

### 📝 Status

**v0.3.1** to **hotfix** dla v0.3.0 naprawiający krytyczne problemy UX które uniemożliwiały korzystanie z aplikacji.

## [0.3.0] - 2025-09-01

### 🤖 Wsparcie dla wielu botów

- **✨ Nowy system multi-bot**

  - Wybór liczby botów (1-4) bezpośrednio w grze
  - Przełączanie między botami podczas rozgrywki
  - Wspólna talia dla wszystkich botów
  - Brak nazw botów (zgodnie z wymaganiem - kody gry nie obsługują nazw)

- **🎯 UI wyboru botów**

  - Grid layout 2x2 dla przycisków wyboru
  - Wybór w grze zamiast w menu ustawień
  - Intuicyjny flow: Start Game → Wybór botów → Gra

- **🔄 Przełączanie botów**
  - Interactive bot switcher w statusie gry
  - Aktywny bot highlighting z białym tłem
  - Hover effects i smooth transitions
  - Możliwość przełączania w dowolnym momencie gry

### 🏗️ Zmiany architektoniczne

- **🧩 Rozszerzone GameState**

  - `botsSelected?: boolean` - gate dla UI flow
  - `botCount?: number` - liczba botów (1-4)
  - `currentBot?: number` - aktualny bot (1-X)

- **⚡ Nowe GameContext actions**

  - `SELECT_BOTS` - wybór liczby botów + generowanie talii
  - `SWITCH_BOT` - przełączanie aktualnego bota

- **🔗 Rozszerzone kodowanie gry**
  - Format 17-19 znaków dla multi-bot vs 14 dla single bot
  - Automatyczne rozpoznawanie trybu na podstawie długości kodu
  - Backward compatibility z kodami v0.2.x

### 🎨 Zmiany interfejsu

- **📊 Status gry**

  - Wskaźnik "Bot X/Y" tylko dla gier wielobotowych
  - Kompaktowy layout z przełącznikiem botów
  - Responsywny design na małych ekranach

- **🎮 Nowe style CSS**
  - `.botSelection` - interfejs wyboru botów
  - `.botSwitcher` - przełącznik botów w statusie
  - `.botButton` - przyciski numerów botów z active state

### 🔧 Zmiany techniczne

- **📐 TypeScript interface updates**

  - `GameContextType` rozszerzone o `selectBots` i `switchBot`
  - Proper typing dla multi-bot state

- **🎯 UI Flow optimization**
  - Conditional rendering na podstawie `botsSelected` state
  - Seamless transition od wyboru botów do gry

## [0.2.4] - 2025-08-29

### 🎨 Poprawki UI/UX

- **✨ Ulepszone animacje toasta kopiowania**

  - Automatyczne znikanie po 2.5s z animacją fade out
  - Lepszy wygląd z box-shadow i proper CSS variables
  - Poprawiona responsywność na małych ekranach
  - Smooth animacje slide up i fade out

- **🔧 Uproszczony modal wyjścia do menu**

  - Zmniejszono liczbę przycisków z 3 do 2
  - Kombinacja "Tak" + "Kopiuj stan gry" w jeden przycisk
  - Wycentrowane przyciski zamiast wyrównania do prawej
  - Naturalny komunikat: "Czy chcesz wyjść do głównego menu?"

- **🎯 Poprawki przycisków kopiowania**
  - Dodano dedykowany styl `.btn-tertiary` w globals.css
  - Konsystentne hover effects i animacje
  - Lepsze pozycjonowanie i kolory

### 🐛 Poprawki błędów

- **🔍 Bug fix w LoadGameModal**
  - Naprawiono problem z niersetowaniem podglądu gry przy zamykaniu modalu
  - Teraz `gamePreview` jest poprawnie czyszczony przy `handleClose()`

### 📐 Usprawnienia UX

- **💬 Lepsze komunikaty**
  - "Czy chcesz wyjść do głównego menu?" zamiast "Czy na pewno wrócić..."
  - "Tak, skopiuj stan gry i wyjdź" - jasna akcja kombinowana

## [0.2.3] - 2025-08-27

### ✨ Nowe funkcje

- **🔍 Podgląd stanu gry w LoadGameModal**

  - Live preview kodu gry podczas wpisywania
  - Preview pokazuje: liczbę botów, typ talii, aktualnego bota, progress kart

- **⚡ Ulepszona walidacja kodu gry**

  - Walidacja od pierwszego znaku (prefix "ZOO")
  - Uproszczone komunikaty błędów: "Prawidłowy format kodu to ZOO + 0-9 i A-C"

- **🎯 Inteligentny przycisk wczytywania**
  - Aktywny tylko przy prawidłowym kodzie gry
  - Brak możliwości wczytania nieprawidłowych kodów

### 🎨 Zmiany interfejsu

- **📱 Dedykowane style CSS**

  - LoadGameModal.module.css - własny plik stylów
  - Lepsza organizacja stylów (każdy komponent ma własne style)

- **🔧 Optymalizacja layoutu**
  - Usunięto redundantny tekst wprowadzający
  - Kompaktowy preview z czytelnym formatowaniem

### 🏗️ Zmiany techniczne

- **🔧 Rozszerzony GameCodePreview interface**

  - Dodane pole currentBot dla obsługi wielu botów
  - Przygotowanie pod przyszłe funkcjonalności

- **🧩 Funkcja previewGameCode**
  - Dekodowanie aktualnego bota z kodu gry
  - Comprehensive error handling z jasnymi komunikatami

### 📐 Poprawki UX

- **⌨️ Lepsze zachowanie input-a**

  - Zachowanie pozycji kursora podczas filtrowania znaków
  - Natychmiastowa walidacja bez opóźnień

- **📊 Informacyjny preview**
  - Dla 1 bota: liczba botów + aktualna karta
  - Ostrzeżenie o wyczerpaniu talii (🏁 Talia wyczerpana)

## [0.2.2] - 2025-08-25

### ✨ Nowe funkcje

- **📋 Uproszczone kopiowanie kodu gry**
  - Przycisk "Kopiuj stan gry" bezpośrednio w grze
  - Przycisk "Kopiuj kod" w modalu wyjścia do menu
  - Automatyczny toast z potwierdzeniem kopiowania
  - Kopiowanie dostępne tylko po dobraniu pierwszej karty

### 🏗️ Zmiany architektoniczne

- **🗑️ Usunięto ShareGameModal**
  - Zastąpiono prostymi przyciskami kopiowania
  - Zmniejszono złożożność kodu o ~180 linii
  - Uproszczono UX z 3 kroków do 1 kroku

### 🎮 Interfejs użytkownika

- **🔧 Optymalizacja przycisków**
  - Zmniejszono poziomy padding: 1.5rem → 1rem (przyciski ogólne)
  - Zmniejszono poziomy padding: 2rem → 1.25rem (przyciski w grze)
  - Lepsze proporcje wizualne

### 🐛 Poprawki błędów

- **⚠️ KRYTYCZNY: Naprawiono stan nowej gry**
  - Nowa gra zawsze zaczyna od czystego stanu (currentCardIndex: -1)
  - Usunięto przeciekanie danych między grami
  - Home.tsx wywołuje newGame() przed nawigacją do gry

### 🔧 Zmiany techniczne

- **🧩 GameContext**

  - Dodano funkcję getCleanState() dla czystego stanu
  - NEW_GAME i RESET_GAME używają getCleanState() zamiast initialState
  - Poprawiono logikę inicjalizacji gry

- **🔧 Nowe funkcje utility**
  - copyGameCodeToClipboard() - prosty interface kopiowania z komunikatami
  - Automatyczne generowanie i kopiowanie kodu w jednym kroku

## [0.2.1] - 2025-08-25

### ✨ Nowe funkcje

- **💾 Ultra-kompaktowy system kodów gry**

  - Kody gry mają zawsze wielkie litery (ZOO + 0-9, A-C)
  - Format: 17 znaków (1 bot) lub 19 znaków (2-4 boty)
  - Kody są w pełni cross-device (można je przesyłać między urządzeniami)
  - System automatycznie rozpoznaje tryb gry na podstawie długości kodu
  - Przykład kodu: `ZOOA0CB5938416274`
  - 90% redukcja długości względem systemów Base64/LZ-String

- **🔗 Cross-device compatibility**
  - Kody zawierają pełne dane gry (nie wymagają localStorage)
  - Działają między różnymi urządzeniami i przeglądarkami
  - Walidacja format wielkich liter w UI wczytywania

### 🏗️ Zmiany architektoniczne

- **🧩 GameState interface**

  - Usunięto `shuffleCount` i `gameStarted` (niepotrzebne w nowym systemie)
  - Dodano opcjonalne `botCount` i `currentBot` dla przyszłych wersji
  - Uproszczenie struktury danych

- **🛠️ Utilities gameStorage**
  - `encodeCard()` / `decodeCard()` - mapowanie 0-12 na 0-9,A-C
  - `generateShareableCode()` - tworzenie kodów zawsze wielkimi literami
  - `loadFromShareableCode()` - wczytywanie z obsługą case-insensitive
  - `isValidGameCode()` - walidacja formatu i długości
  - Usunięto dependency na localStorage w kodach

### 🎮 Interfejs użytkownika

- **📝 ShareGameModal** - Generowanie kodów zawsze wielkimi literami
- **📥 LoadGameModal** - Akceptowanie wielkich liter, walidacja ZOO prefixu
- **🏠 Home.tsx** - Aktualizacja sekcji wersji na v0.2.1

### 🔧 Zmiany techniczne

- **📦 Wersja 0.2.1** - Aktualizacja package.json
- **🧹 Czyszczenie kodu** - Usunięto wszystkie console.log z produkcji
- **📋 Dokumentacja** - Aktualizacja README.md, DOCS.md, GAME-CODES.md

## [0.2.0] - 2025-08-23

### ✨ Nowe funkcje

- **💾 System zapisywania i wczytywania gry**

  - Automatyczne zapisywanie stanu gry w localStorage
  - Możliwość generowania kodów gry (localStorage-only)
  - Base64 encoding z checksumami dla bezpiecznego kodowania
  - ⚠️ **Ograniczenia**: Kody działają tylko w tej samej przeglądarce

- **🔗 Modale udostępniania i wczytywania**
  - ShareGameModal - generowanie kodów do zapisywania stanu
  - LoadGameModal - wczytywanie gry z lokalnych kodów
  - Walidacja kodów gry z odpowiednimi komunikatami błędów
  - Kopiowanie do schowka z wizualnym potwierdzeniem

### ⚠️ Znane ograniczenia v0.2.0

- **localStorage-only system**: Kody działają tylko w tej samej przeglądarce
- **Brak cross-device**: Nie można udostępniać kodów między urządzeniami
- **Długie kody**: Base64 format generuje nieczytelne kody (~175 znaków)

### 🏗️ Zmiany architektoniczne

- **🧩 BaseModal component**

  - Uniwersalny modal bazujący na istniejącym ConfirmModal
  - Reużywalne style dla spójności designu
  - Usunięcie duplikacji CSS między modalami

- **⚛️ GameContext rozszerzenia**

  - Dodano `loadGame` action do wczytywania stanu
  - Integracja z gameStorage utilities
  - Auto-save functionality z useEffect

- **🛠️ Utilities gameStorage**
  - `serializeGameState()` - konwersja stanu do Base64
  - `deserializeGameState()` - dekodowanie z walidacją
  - `generateShareableCode()` - tworzenie kodów gry
  - `loadFromShareableCode()` - wczytywanie z kodów
  - `autoSaveGameState()` - automatyczne zapisywanie
  - `copyToClipboard()` - helper do kopiowania

### 🎮 Interfejs użytkownika

- **🏠 Home.tsx** - Aktywacja przycisku "Wczytaj grę"
- **🎯 Game.tsx** - Dodanie przycisku "Udostępnij grę"
- **📱 Responsywny design** - Modale dostosowane do urządzeń mobilnych

### 🔧 Zmiany techniczne

- **📦 Wersja 0.2.0** - Aktualizacja package.json
- **🌿 Nowa gałąź v0.2.0** - Organizacja rozwoju wersji
- **🧪 TypeScript** - Pełna typizacja nowych komponentów
- **♻️ Refaktor modali** - Eliminacja duplikacji styli CSS

## [0.1.4] - 2025-08-22

### 🐛 Naprawione błędy

- **🖥️ Poprawione centrowanie na desktopie**
  - Naprawiono problem z centrowaniem aplikacji na szerszych ekranach (>480px)
  - Unified szerokość aplikacji - wszystkie ekrany używają teraz spójnego systemu 480px max-width
  - Dodano lepsze media queries dla ekranów desktop z `margin: 0 auto`
  - Poprawiono CSS variables dla `--max-width` z lepszym calc() dla narrow screens
  - Home description nie używa już własnej max-width 400px (teraz 100% z Layout)

### 🔧 Zmiany techniczne

- **📦 Wersja 0.1.4** - Aktualizacja package.json
- **🎯 Layout.module.css**: Dodano explicite `max-width: 480px` i `margin: 0 auto` dla desktop, positioning i z-index
- **🌐 globals.css**: Ulepszone media queries dla spójnego centrowania, refaktor background utilities
- **🏠 Home.module.css**: Usunięto konflictujące max-width z heroDescription
- **🎯 Layout.tsx**: Dodano useEffect dla dynamicznego zarządzania klasami tła na body
- **🎨 BotCard.module.css**: Zmieniono max-width z 400px na 100% dla Layout consistency
- **🎮 Game.module.css**: Usunięto ograniczenie max-width 300px z przycisków, zwiększono card-reverse
- **⚛️ Game.tsx**: Dodano `game.resetGame()` call w `confirmExit()` dla proper state management

### 📁 Bug fix dla Issue #13

- "Ekran nie jest wyśrodkowany w wersji desktopowej" - ROZWIĄZANY ✅

### 📁 Bug fix dla Issue #14

- "Tło nie zajmuje całego ekranu i nie jest wyśrodkowane" - ROZWIĄZANY ✅

### 📁 Bug fix dla Issue #15

- "Niespójne szerokości elementów na różnych ekranach" - ROZWIĄZANY ✅

### 📁 Bug fix dla Issue #16

- "Stan gry nie jest resetowany przy powrocie do menu" - ROZWIĄZANY ✅

### 🐛 Naprawione błędy

- **🎨 Poprawione tła pełnoekranowe**

  - Naprawiono problem z tłami nie pokrywającymi całego ekranu (Issue #14)
  - Przeniesiono aplikację tła z Layout component na body element dla full-screen coverage
  - Dodano `background-attachment: fixed` dla stabilnych teł podczas scroll
  - Wprowadzono subtelny overlay (0.05 opacity) dla lepszej czytelności tekstu
  - Ulepszona hierarchia z-index (Layout z-index: 1, overlay z-index: 0)

- **� Spójność układu na różnych ekranach**

  - Naprawiono niespójne szerokości elementów między ekranami (Issue #15)
  - BotCard: zmieniono max-width z 400px na 100% dla pełnego wykorzystania Layout
  - Game buttons: usunięto ograniczenie max-width 300px dla spójności z Layout
  - Game card-reverse: zwiększono max-width z 200px na 250px dla lepszej proporcji
  - Wszystkie komponenty używają teraz unified Layout max-width system (480px)

- **🎮 Poprawiony reset stanu gry**
  - Naprawiono problem z nieresetowaniem stanu gry przy powrocie do menu (Issue #16)
  - Dodano wywołanie `game.resetGame()` w funkcji `confirmExit()` w Game.tsx
  - Modal ostrzeżenia pozostaje aktywny dla informacji użytkownika
  - Stan gry jest teraz prawidłowo resetowany przed nawigacją do menu

### 🔧 Zmiany techniczne

- **🎯 Layout.tsx**: Dodano useEffect dla dynamicznego zarządzania klasami tła na body
- **🌐 globals.css**: Refaktor background utilities - aplikacja na body, nie Layout
- **📱 Layout.module.css**: Dodano positioning i z-index dla proper layering

## [0.1.3] - 2025-08-21

### ✨ Nowe funkcjonalności

- **🎨 System grafik tła**
  - Dodano grafikę `home-bg.jpg` na stronie głównej dla lepszego efektu wizualnego
  - Dodano grafikę `game-bg.jpg` na ekranie gry jako pełne tło (nie overlay)
  - Implementacja grafiki `card-reverse.jpg` na ekranie 0/13 - symbolizuje zakryty stos kart
  - CSS utility classes: `.bg-home`, `.bg-game` dla łatwego zarządzania tłami
  - CSS variables: `--home-bg`, `--game-bg` dla elastycznej konfiguracji

### 🎨 Ulepszenia UX

- **⚡ Drastyczna optymalizacja interfejsu**
  - Zmniejszenie margin header z 32px na 12px (62% redukcja)
  - Kompaktowy padding w gameStatus z 16px na 2px w pionie (87% redukcja)
  - Globalny --gap zmniejszony z 12px na 8px (33% redukcja)
  - CardArea min-height z 300px na 150px (50% redukcja)
  - Card reverse image max-width z 250px na 200px (20% redukcja)

### 🔧 Zmiany techniczne

- **🧩 Rozszerzony Layout component**

  - Dodano `backgroundType` prop dla dynamicznego wyboru tła
  - Implementacja `getBackgroundClass()` dla type-safe background switching
  - Import CSS-in-TS dla card-reverse.jpg asset optimization

- **📱 Responsive improvements**
  - Poprawki w media query `@media (max-width: 768px)` dla gameStatus
  - Spójny padding na wszystkich urządzeniach mobilnych
  - Zachowana funkcjonalność przy maksymalnie kompaktowym designie

### 🎨 Polepszenia wizualne

- **🎨 Efektowne tła**
  - Pełne grafiki tła zamiast subtelnych overlay effects
  - Responsywne tła z `background-size: cover` i `background-position: center`
  - Professional card-reverse visualization dla stanu początkowego gry

## [0.1.2] - 2025-08-20

### ✨ Nowe funkcjonalności

- **🔄 Profesjonalny modal potwierdzenia**
  - Zastąpienie natywnego `window.confirm()` przeglądarki
  - Komponent `ConfirmModal` z pełną responsywnością i animacjami
  - Spójny design system z kolorystyką ZOO
  - Obsługa klawisza Escape i kliknięcia poza modal
  - Opcjonalny tytuł - modal może działać z nagłówkiem lub bez

### 🎨 Ulepszenia UX

- **⚡ Płynny gameplay**
  - Natychmiastowe dobieranie kart bez przeszkód
  - Modal tylko dla wyjścia z gry (rzeczywisty "punkt bez powrotu")
  - Krótsza, jaśniejsza wiadomość: "Czy na pewno wrócić do głównego menu? Stan gry zostanie utracony."

### 🎨 Polepszenia wizualne

- **🎨 Spójne kolory**
  - Modal dopasowany do kolorystyki ZOO (kremowe tło, brązowe elementy)
  - Wykorzystanie zmiennych CSS z głównego design systemu
  - Profesjonalne animacje fade/slide z responsywnym designem

### 🔧 Zmiany techniczne

- **🧩 Uniwersalny komponent ConfirmModal**
  - Wielokrotnego użytku z konfigurowalnymi props
  - Opcjonalny `title` dla różnych przypadków użycia
  - Gotowy do wykorzystania w przyszłych funkcjonalnościach

## [0.1.1] - 2025-08-19

### 🎨 Ulepszenia UX

- **🔄 Uproszczony interfejs gry**
  - Konsolidacja 3 przycisków do 1 dynamicznego przycisku głównego:
    - 0/13: "🎯 Dobierz pierwszą kartę"
    - 1-11/13: "🎯 Dobierz następną kartę"
    - 12/13: "🎯 Dobierz ostatnią kartę"
    - 13/13: "🔀 Przetasuj i dobierz kartę"
  - Usunięcie redundantnej informacji o pozostałych kartach
  - Całkowite usunięcie przycisku "Reset gry" dla czystszego interfejsu
  - Lepsze wyśrodkowanie statusu gry i informacji
  - Zwiększenie rozmiaru głównego przycisku akcji
  - Poprawiona responsywność na urządzeniach mobilnych

### 📱 Responsywność

- **📱 Optymalizacja mobilna**
  - Lepsze wyśrodkowanie elementów na małych ekranach
  - Uproszczony układ kontrolek (tylko 1 główny przycisk + powrót do menu)
  - Ulepszony układ statusu gry dla urządzeń mobilnych

## [0.1.0] - 2025-08-19

### ✨ Dodane

- **🎮 Kompletna mechanika kart**
  - 13 kart botów Lorem Ipsum z efektami i zdolnościami
  - Losowanie, tasowanie i reset kart
  - Zarządzanie stanem gry z React Context + useReducer
  - Komponent BotCard z responsywnym designem
  - Kontrolki gry: "Dobierz kartę", "Przetasuj talię", "Reset gry"
  - Auto-start gry po wejściu na stronę
  - Statystyki gry: aktualna karta, pozostałe karty, liczba tasowań

### 🎯 Doświadczenie użytkownika

- Płynne animacje kart z CSS keyframes
- Disabled states dla przycisków gdy to właściwe
- Mobile-first responsive design (320px+ WCAG compliant)
- Intuicyjny flow: Home → "Rozpocznij grę" → natychmiastowe wyświetlenie karty

### 🏗️ Techniczne

- TypeScript full type safety z custom interfaces
- System CSS custom properties dla spójnego stylingu
- Profesjonalna struktura projektu z rozdzielonymi odpowiedzialnościami
- Implementacja algorytmu Fisher-Yates shuffle
- Czyste procesy build i lint

### 🔧 Zmienione

- Game.tsx: usunięto zbędny ekran startowy, auto-start gry
- Struktura: skonsolidowano typy w /types/index.ts
- CSS: optymalizacja i usunięcie nieużywanych reguł

## [0.0.3] - 2025-08-18

### Naprawione

- 🐛 **WCAG 320px compliance**: Naprawiono poziomy overflow na ekranach 320px (wymóg dostępności)
- 🐛 **Horizontal scrolling**: Wyeliminowano poziome przewijanie na małych ekranach (320px-360px)
- 🐛 **CSS media query conflicts**: Naprawiono konflikty między różnymi zakresami responsywności
- 🐛 **Card sizing issues**: Ujednolicono szerokość kart dla płynnych przejść między rozmiarami ekranu

### 📁 Bug fixes dla Issues

- Issue #7: "Horizontal overflow na bardzo małych ekranach (≤320px)" - ROZWIĄZANY ✅

### Dodane

- ✅ **CSS custom properties**: Wprowadzono zmienne dla responsywnych font-size i spacing
- ✅ **Unified small screen support**: Jeden spójny styl dla wszystkich ekranów ≤360px
- ✅ **Responsive font system**: System zarządzania czcionkami przez CSS custom properties

### Zmienione

- 🔧 **Media queries**: Uproszczono z wielu zakresów do jednolitego `@media (max-width: 360px)`
- 🔧 **CSS architecture**: Refaktor - eliminacja `clamp()` na rzecz CSS custom properties
- 🔧 **Small screen layout**: Zoptymalizowano layout dla ekranów 320px-360px z równymi odstępami
- 🔧 **Code maintainability**: Zmniejszono duplikację CSS poprzez centralne zarządzanie responsive styles

### Techniczne

- 📦 **CSS bundle size**: Zoptymalizowano z 10.49kB → 10.03kB
- 🧹 **Code cleanup**: Usunięto konfliktujące reguły CSS i uproszono strukturę responsywności

## [0.0.2] - 2025-08-17

### Naprawione

- 🐛 **Layout viewport issues**: Naprawiono urwane tło na dole ekranu (`background-attachment: fixed`, `100dvh`)
- 🐛 **Content overflow**: Poprawiono wyświetlanie na małych ekranach - zawartość nie była w pełni widoczna
- 🐛 **Responsywność czcionek**: Zastąpiono stałe rozmiary czcionek responsywnymi (`clamp()`)
- 🐛 **Padding na małych ekranach**: Dodano responsywny padding dla urządzeń <380px

### 📁 Bug fixes dla Issues

- Issue #2: "Responsywność: Czcionki zbyt duże na małych ekranach" - ROZWIĄZANY ✅
- Issue #3: "Overflow: Zawartość nie mieści się na ekranie na małych urządzeniach" - ROZWIĄZANY ✅
- Issue #4: "Gradient tła nie pokrywa całego ekranu (urwane tło na dole)" - ROZWIĄZANY ✅

### Dodane

- ✅ **Automatyczne wersje**: Import `package.json` dla dynamicznego wyświetlania wersji
- ✅ **Media queries**: Lepsze wsparcie dla bardzo małych ekranów
- ✅ **TypeScript JSON support**: Dodano `resolveJsonModule` w konfiguracji

### Zmienione

- 🔧 **CSS**: Użyto `100dvh` zamiast `100vh` dla lepszej obsługi mobile browsers
- 🔧 **Responsywność**: Dodano `clamp()` dla wszystkich rozmiarów czcionek
- 🔧 **Base font-size**: Zrobiono responsywnym (14-16px zależnie od ekranu)

## [0.0.1] - 2025-08-16

### Dodane

- ✅ Setup React + TypeScript + Vite (dostosowany do Node 18)
- ✅ Routing z React Router (`/` i `/game`)
- ✅ Responsywny design mobile-first
- ✅ Layout z kolorami z instrukcji gry (żółto-zielone tło, brązowe nagłówki)
- ✅ Struktura folderów projektu (components, pages, hooks, etc.)
- ✅ TypeScript interfaces dla całej aplikacji
- ✅ Globalne style CSS z paletą kolorów z instrukcji
- ✅ Strona główna z menu opcji
- ✅ Placeholder ekranu gry (gotowy na v0.1.0)
- ✅ ESLint konfiguracja
- ✅ Build i lint bez błędów

### Techniczne

- React 19.1.1
- TypeScript 5.8.3
- Vite 5.4.19 (downgraded dla Node 18)
- React Router DOM 7.8.1
- CSS Modules dla stylów

## [0.0.0] - 2025-08-16

### Dodane

- Utworzenie repozytorium
- Dokumentacja projektu (`DOKUMENTACJA.md`)
- Plan rozwoju i roadmapa
- README.md z opisem projektu
- CHANGELOG.md
- TODO.md

### Uwagi

- Projekt w fazie planowania
- Setup i implementacja wersji 0.0.1
