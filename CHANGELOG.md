# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
projekt stosuje [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.2] - 2025-11-02

### Dodane

- System globalnych klas CSS (`.card`, `.section`, `.btn-logo`, `.info-box`) dla spójności designu
- Precyzyjny system walidacji kodów gry z szczegółowymi komunikatami błędów
- Funkcje pomocnicze `getZMValidationError()` i `getZPValidationError()` w gameStorage.ts

### Zmienione

- Uproszczenie LoadGame UX: usunięcie verbose instrukcji, lepszy placeholder
- Centralizacja walidacji: szczegółowe błędy w gameStorage.ts zamiast UI
- Elegancki wyświetlacz stanu talii: kompaktowy format z borderem dla aktywnego bota

### Naprawione

- Walidacja ZM: `includes("Z")` znajdował Z z prefiksu zamiast separatora
- Ogólne komunikaty błędów zastąpione precyzyjnymi (ZM/ZP formaty)
- Z-index konflikty między kartami a przyciskami
- Spójność odstępów i hierarchii nagłówków

### Usunięte

- Duplikujące się style CSS z komponentów
- Verbose sekcje instrukcji w LoadGame

---

## [0.5.1] - 2025-10-29

### Dodane

- About page (`/about`) z informacjami o grze i aplikacji
- Sekcja gry z linkami (BGG, Planszeo, Facebook)
- Menu: przycisk "O grze i aplikacji"
- Plik stylów `About.module.css` dla strony About
- Bezpieczne otwieranie linków zewnętrznych w About (target/rel)

### Zmienione

- Przeniesienie i porządkowanie assetów (logos/, icons/)
- Ujednolicenie przycisków na About (użycie `.btn-secondary`)

---

## [0.5.0] - 2025-10-25

### Dodane

- System trzech czcionek: ChillScript (nagłówki), RooneySansBold (tekst), MarvinRound (karty)
- Logo Spółka ZOO na stronie głównej z integracją w komponencie Layout
- Zmienne CSS dla typografii: --font-display, --font-body, --font-card
- Globalne style dla wszystkich nagłówków (h1, h2, h3, h4)
- Zunifikowany system kart we wszystkich komponentach
- Sekcja podglądu w stylu karty bota dla LoadGame

### Zmienione

- System typografii: h1 z cieniem tekstu, h2 wyśrodkowane z ChillScript
- Struktura GameSetup: jedna karta z trzema sekcjami (boty, tryb, start)
- Interfejs LoadGame: warunkowo pokazuje instrukcje lub podgląd
- Układ GamePlay: przycisk "DOBIERZ KARTĘ" nad kartą dla lepszego UX
- Stylowanie BotCard: czcionka MarvinRound dla lepszej czytelności
- Komponent Layout: refaktor z obsługą logo jako właściwość
- Przyciski używają var(--font-body) zamiast dziedziczenia czcionki

### Naprawione

- Spójność h2: usunięcie lokalnych nadpisań na rzecz globalnych stylów
- Jednolity rozmiar czcionki: wszystkie h2 używają 1.5rem
- Marginesy podglądu: poprawne odstępy w sekcji podglądu LoadGame
- Padding kart: zoptymalizowane odstępy (2rem→0.5rem na górze)
- Spójność kolorów: kolory błędów używają var(--danger)
- Pozycjonowanie akcji: przyciski poza ramką dla spójności z innymi ekranami

---

## [0.4.7] - 2025-10-15

### Dodane

- Pełnoekranowy ekran wczytywania gry zamiast modala
- Przycisk zamknięcia (X) w modalu
- Trzeci przycisk "Wyjdź bez zapisu" w modalu wyjścia z gry

### Zmienione

- Uproszczenie struktury modalnej (4 pliki → 2 pliki)
- Przyciski w modalach wyrównane do prawej strony
- Kolejność przycisków: "Kopiuj stan gry" przed "Wróć do menu"
- Tekst trybu gry: "1 bot, jedna talia" zamiast "osobne talie"

### Naprawione

- Wskaźnik kart pokazuje 1/13 zamiast 2/13 po przetasowaniu
- Efekt hover na przycisku "Rozpocznij grę"
- Niewidoczne nagłówki w modalach
- Usunięto niepotrzebny komunikat "Talia wyczerpana"

### Usunięte

- LoadGameModal (zastąpiony pełnym ekranem)
- BaseModal (scalone z ConfirmModal)

---

## [0.4.6] - 2025-10-12

### Dodane

- TypeScript Path Mapping - aliasy `@lib`, `@game`, `@ui` dla czytelnych importów
- BaseModal - uniwersalny komponent bazowy dla wszystkich modalów

### Zmienione

- Podział Game.tsx na 3 specjalizowane komponenty:
  - Game.tsx - router między fazami gry
  - GameSetup.tsx - konfiguracja botów i trybu gry
  - GamePlay.tsx - aktywna rozgrywka
- Reorganizacja folderów na `src/components/game/`, `src/components/ui/`, `src/lib/`
- ConfirmModal i LoadGameModal używają BaseModal dla spójności interfejsu
- Wszystkie importy zaktualizowane do path aliases

### Naprawione

- Korupcja plików z polskimi znakami - przywrócono oryginalne teksty
- Problemy z kodowaniem UTF-8 w plikach CSS
- Błędne ścieżki obrazków tła w globals.css
- Duplikaty stylów CSS między modalami
- Ostrzeżenia Vite o nierozwiązanych obrazkach podczas build

### Usunięte

- Niepotrzebny Game.module.css - pusty plik bez definicji stylów
- Zduplikowane style przycisków i akcji w modalach

---

## [0.4.5] - 2025-10-09

### Dodane

- Własny favicon (zoo.png) zastępujący domyślny Vite
- Dynamiczne tytuły header ("Rozpocznij grę" / "Gra w toku")
- Informacyjne subtitle z szczegółami o botach i trybie gry

### Zmienione

- Usunięcie spisu funkcjonalności z ekranu głównego
- Profesjonalny tytuł strony: "Spółka ZOO - Bot Pomocnik"
- Ujednolicona kolorystyka przycisków wyboru trybu gry
- Stabilny layout - przyciski nie zmieniają rozmiaru

### Naprawione

- Logika resetowania przy odświeżaniu strony
- Walidacja stanu aplikacji (konfiguracja vs aktywna gra)
- Inteligentne rozpoznawanie flow wyjścia z gry

## [0.4.4] - 2025-10-05

### Usunięte

- Kompletne wycofanie przestarzałego formatu ZOO z aplikacji
- Funkcje `GAME_CODE_PREFIX` i `decodeLegacyZooPayload()` z gameStorage.ts
- Referencje do formatu ZOO w LoadGameModal

### Zmienione

- Uproszczona logika walidacji i parsowania kodów
- Redukcja rozmiaru aplikacji przez eliminację nieużywanego kodu

---

## [0.4.3] - 2025-10-04

### Dodane

- Format ZP (Per-Bot) dla niezależnych talii każdego bota
- Zaawansowana walidacja ZP z kontrolą separatorów i duplikatów
- Podgląd pozycji każdego bota osobno w LoadGameModal

### Zmienione

- Enkoder/dekoder ZP w gameStorage.ts
- Automatyczny wybór optymalnego formatu przy generowaniu kodów
- Ulepszona logika aktywności przycisków w LoadGameModal

### Naprawione

- Nieprawidłowe pozycje botów po załadowaniu kodu ZP
- Walidacja przycisków dla krótkich kodów (ZS, ZM)
- Błędne sprawdzanie duplikatów między taliami botów

---

## [0.4.2] - 2025-10-01

### Dodane

- Implementacja formatu ZM (Multi-Shared) dla wielu botów ze wspólną talią
- Kodowanie/dekodowanie, walidacja i podgląd formatu ZM
- Akceptacja separatora `Z` w formatach wielobotowych

### Zmienione

- Rozszerzone LoadGameModal.tsx o walidację ZM i lepsze komunikaty błędów
- Scentralizowane enkodery/dekodery w gameStorage.ts
- Ulepszony podgląd przed wczytaniem

### Naprawione

- Rozbieżności między podglądem a załadowanym stanem gry
- Poprawna rekonstrukcja sekwencji 13 kart i currentCardIndex

---

## [0.4.1] - 2025-09-27

### Dodane

- Format ZS Single-Bot z alfabetem A,B,C dla kart 10,11,12
- Zaawansowana walidacja kodów gry z kontrolą duplikatów i zakresu
- Podgląd stanu gry przed wczytaniem (pozycja X/13)

### Zmienione

- Przepisanie gameStorage.ts jako główna implementacja
- Optymalizacja wielkości ikon i responsywności interfejsu
- Refaktoryzacja logiki tasowania i walidacji

### Usunięte

- Niepotrzebny komunikat "Talia wyczerpana"

### Naprawione

- Kompatybilność wsteczna z formatem ZOO

---

## [0.4.0] - 2025-09-13

### Dodane

- Wybór trybu gry: wspólna talia lub osobne talie dla każdego bota
- Możliwość niezależnie tasowanych talii dla każdego bota
- Interfejs wyboru trybu gry i liczby botów na ekranie startowym
- Pełna obsługa wyczerpania talii dla każdego bota osobno

### Zmienione

- Refaktoryzacja GameContext.tsx pod obsługę trybu indywidualnych talii
- Rozbudowa reducerów, selektorów i akcji dla obsługi obu trybów

---

## [0.3.5] - 2025-09-11

### Dodane

- Globalne kolorowanie fraz kluczowych w kartach botów zgodnie z oryginalnymi zasadami
- Uproszczone zarządzanie ikonami przez obiekt ICONS
- Pełne oryginalne opisy kart zgodne z grą Spółka ZOO

### Zmienione

- Usunięto pogrubienie z kolorów dla lepszej czytelności
- Ujednolicenie stylów i uproszczenie kodu danych kart

## [0.3.4] - 2025-09-07

### Zmienione

- Ulepszone komunikaty gry: bardziej opisowe akcje botów z ikonkami
- Ujednolicone wskaźniki stanu gry (bot i karta) z tym samym kolorem tła
- Usunięte nazwy i numery kart z interfejsu dla czytelności
- Nowa logika opisów efektów: "Efekt", "Pierwszy/Drugi efekt", "Zdolność dodatkowa"

### Usunięte

- Niepotrzebny `src/App.css` i zminimalizowany `src/index.css`

## [0.3.3] - 2025-09-04

### Usunięte

- Ręczne przełączniki botów (1, 2, 3, 4) z interfejsu gry
- Zastąpiono wskaźnikiem "Aktualny bot: X/Y"

### Dodane

- Dwa inteligentne przyciski: "Dobierz kartę dla bota X" i "Dobierz dla następnego bota"
- Automatyczna kolejność botów (1 → 2 → 3 → 4 → 1)
- Kompletna obsługa wyczerpania talii z przyciskami przetasowania

### Zmienione

- Mechanika gry zgodna z zasadami planszówki
- Responsywny układ dwóch przycisków w `.gameControls`

## [0.3.2] - 2025-09-03

### Dodane

- Przeprojektowany interfejs wyboru botów w stylu kart z zoo-tematyczną paletą
- Automatyczne dobieranie pierwszej karty po wyborze botów
- Gradienty i efekty hover dla lepszego użytkowego

### Usunięte

- Mylący ekran pośredni "Gotowy do rozpoczęcia gry"
- Niepotrzebny ekran "Dobierz pierwszą kartę"

### Naprawione

- Pusty ekran po odświeżeniu strony w trakcie wyboru botów
- Uproszczono logikę renderowania warunkowego

## [0.3.1] - 2025-09-02

### Naprawione

- KRYTYCZNY błąd nieskończonych re-renderów "Maximum update depth exceeded"
- Zmemorizowano `contextValue` w GameContext używając `useMemo`
- Przepływ gry - przyciski powrotu do menu głównego działają poprawnie
- Wyświetlanie licznika kart - ukryty w menu wyboru botów i przed pierwszą kartą

### Usunięte

- Przycisk "Ustawienia" z menu głównego
- Tymczasowo wyłączono auto-save dla stabilności

## [0.3.0] - 2025-09-01

### Dodane

- System wielu botów (1-4) z wyborem bezpośrednio w grze
- Przełączanie między botami podczas rozgrywki ze wspólną talią
- Interfejs wyboru botów z układem siatki 2x2
- Interaktywny przełącznik botów w statusie gry z podświetleniem aktywnego

### Zmienione

- Rozszerzone GameState o `botsSelected`, `botCount`, `currentBot`
- Format kodów gry: 17-19 znaków dla wielu botów vs 14 dla jednego
- Automatyczne rozpoznawanie trybu na podstawie długości kodu

## [0.2.4] - 2025-08-29

### Zmienione

- Ulepszone animacje toasta kopiowania - automatyczne znikanie po 2.5s
- Uproszczony modal wyjścia do menu - zmniejszono przyciski z 3 do 2
- Kombinacja "Tak" + "Kopiuj stan gry" w jeden przycisk
- Lepsze komunikaty: "Czy chcesz wyjść do głównego menu?"

### Naprawione

- Problem z resetowaniem podglądu gry przy zamykaniu LoadGameModal

## [0.2.3] - 2025-08-27

### Dodane

- Podgląd stanu gry w LoadGameModal podczas wpisywania kodu
- Walidacja kodu od pierwszego znaku (prefix "ZOO")
- Inteligentny przycisk wczytywania - aktywny tylko przy prawidłowym kodzie

### Zmienione

- Dedykowane style CSS dla LoadGameModal
- Uproszczone komunikaty błędów walidacji
- Lepsze zachowanie pola tekstowego (zachowanie pozycji kursora)

## [0.2.2] - 2025-08-25

### Dodane

- Uproszczone kopiowanie kodu gry - przyciski "Kopiuj stan gry" bezpośrednio w grze
- Automatyczny toast z potwierdzeniem kopiowania
- Funkcja `copyGameCodeToClipboard()` z komunikatami

### Usunięte

- ShareGameModal - zastąpiono prostymi przyciskami (zmniejszono kod o ~180 linii)

### Naprawione

- KRYTYCZNY błąd: nowa gra zawsze zaczyna od czystego stanu (currentCardIndex: -1)
- Przeciekanie danych między grami

## [0.2.1] - 2025-08-25

### Dodane

- Ultra-kompaktowe kody gry: 17/19 znaków (ZOO + 0-9,A-C)
- Współdzielenie między urządzeniami - kody działają wszędzie
- Automatyczne rozpoznawanie trybu gry na podstawie długości kodu

### Zmienione

- 90% redukcja długości kodów względem Base64/LZ-String
- Uproszczenie GameState interface - usunięto `shuffleCount` i `gameStarted`
- Walidacja formatu wielkich liter w LoadGameModal

## [0.2.0] - 2025-08-23

### Dodane

- System zapisywania/wczytywania gry z kodami Base64 w localStorage
- ShareGameModal i LoadGameModal z walidacją kodów
- Automatyczne zapisywanie stanu gry
- Kopiowanie kodów do schowka z potwierdzeniem
- BaseModal component dla spójności wyglądu

### Ograniczenia

- Kody działają tylko w tej samej przeglądarce (localStorage-only)
- Długie kody Base64 (~175 znaków), brak współdzielenia między urządzeniami

## [0.1.4] - 2025-08-22

### Naprawione

- Centrowanie aplikacji na szerszych ekranach desktop (>480px)
- Tła pełnoekranowe - przeniesienie z komponentu układu na element body
- Spójność szerokości elementów między różnymi ekranami
- Reset stanu gry przy powrocie do menu - dodano `game.resetGame()` w `confirmExit()`

### Zmienione

- Unified system szerokości 480px dla wszystkich ekranów
- Dynamiczne zarządzanie klasami tła na body przez useEffect

## [0.1.3] - 2025-08-21

### Dodane

- System grafik tła: `home-bg.jpg`, `game-bg.jpg`, `card-reverse.jpg`
- CSS utility classes `.bg-home`, `.bg-game` i zmienne `--home-bg`, `--game-bg`
- Responsywne tła z `background-size: cover` i `background-position: center`

### Zmienione

- Optymalizacja interfejsu: zmniejszenie marginesów i paddingów
- Layout component z `backgroundType` prop i `getBackgroundClass()`
- Media queries dla lepszej responsywności na urządzeniach mobilnych

### Naprawione

- Centrowanie aplikacji na szerszych ekranach desktop
- Spójność szerokości elementów między różnymi ekranami
- Reset stanu gry przy powrocie do menu

## [0.1.2] - 2025-08-20

### Dodane

- Komponent `ConfirmModal` zastępujący natywny `window.confirm()`
- Obsługa klawisza Escape i kliknięcia poza modal
- Opcjonalny tytuł dla różnych przypadków użycia

### Zmienione

- Natychmiastowe dobieranie kart bez przeszkód
- Modal tylko dla wyjścia z gry
- Kolorystyka ZOO z wykorzystaniem zmiennych CSS

### Naprawione

- Profesjonalne animacje fade/slide z responsywnym designem

## [0.1.1] - 2025-08-19

### Dodane

- Dynamiczny przycisk główny z kontekstowymi komunikatami

### Zmienione

- Konsolidacja 3 przycisków do 1 dynamicznego przycisku głównego
- Lepsze wyśrodkowanie elementów na małych ekranach
- Zwiększenie rozmiaru głównego przycisku akcji

### Usunięte

- Redundantne informacje o pozostałych kartach
- Przycisk "Reset gry" dla czystszego interfejsu

## [0.1.0] - 2025-08-19

### Dodane

- Kompletna mechanika gry z 13 kartami botów
- Zarządzanie stanem z React Context + useReducer
- Komponent BotCard z responsywnym układem
- Kontrolki gry: "Dobierz kartę", "Przetasuj talię", "Reset gry"
- Automatyczny start gry i statystyki (algorytm tasowania Fisher-Yates)
- Płynne animacje kart i projekt dostosowany do urządzeń mobilnych

### Zmienione

- Usunięto zbędny ekran startowy
- Skonsolidowano typy w /types/index.ts
- Zoptymalizowano CSS

## [0.0.3] - 2025-08-18

### Naprawione

- Poziome przewijanie na ekranach 320px (zgodność z wymogami dostępności)
- Konflikty między zakresami responsywności
- Problemy z rozmiarami kart na różnych ekranach

### Dodane

- Zmienne CSS dla responsywnych rozmiarów czcionek i odstępów
- Jednolite wsparcie dla małych ekranów (≤360px)

### Zmienione

- Uproszczono media queries do `@media (max-width: 360px)`
- Refaktor architektury CSS - zastąpiono `clamp()` zmiennymi CSS

## [0.0.2] - 2025-08-17

### Naprawione

- Problemy z widocznym obszarem - urwane tło na dole ekranu (`100dvh`)
- Przepełnienie zawartości na małych ekranach
- Responsywność czcionek - zastąpiono stałe rozmiary funkcją `clamp()`
- Czcionki zbyt duże na małych ekranach
- Gradient tła nie pokrywający całego ekranu

### Dodane

- Automatyczne wersje z `package.json`
- Lepsze zapytania mediów dla małych ekranów
- Obsługa JSON w TypeScript (`resolveJsonModule`)

## [0.0.1] - 2025-08-16

### Dodane

- Konfiguracja React + TypeScript + Vite (Node 18)
- Routing z React Router (`/` i `/game`)
- Responsywny projekt dla urządzeń mobilnych z kolorami ZOO
- Struktura folderów projektu i interfejsy TypeScript
- Strona główna z menu i przygotowany ekran gry

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
