# System zapisu gry - Spółka ZOO Bot Pomocnik

## 📖 Specyfikacja systemu kodów gry v0.2.1

Kody gry są zawsze generowane i akceptowane wyłącznie wielkimi literami (ZOO + 0-9, A-C).

- Kod gry jest zawsze generowany wielkimi literami, niezależnie od urządzenia czy przeglądarki.
- Wklejanie kodu do pola wczytywania akceptuje tylko wielkie litery.

---

## 🔧 Architektura systemu

### Podstawowe założenia

- **Jedna talia**: 13 kart oznaczonych indeksami 0-12
- **Alfanumeryczne kodowanie**: Użycie znaków 0-9 oraz A-C (łącznie 13 symboli)
- **Zakres botów**: 1-4 boty zgodnie z ograniczeniami gry
- **Optymalizacja**: 1 bot = 17 znaków, 2-4 boty = 19 znaków
- **Brak historii**: System zapisuje tylko aktualny stan talii, nie przechowuje historii przetasowań
- **Auto-detect**: Liczba botów i tryb gry rozpoznawane automatycznie na podstawie długości kodu

### Mapowanie indeksów kart

```
Indeks karty → Symbol
0 → 0     7 → 7
1 → 1     8 → 8
2 → 2     9 → 9
3 → 3    10 → A
4 → 4    11 → B
5 → 5    12 → C
6 → 6
```

---

## 📝 Format kodów gry

### Struktura kodu

Każdy kod gry składa się z:

1. **Prefix**: `ZOO` (3 znaki) - identyfikator aplikacji
2. **Dane gry**: Zakodowany stan gry (długość zależna od trybu)

### Tryby gry i długości kodów

| Tryb gry             | Długość kodu  | Format                                            | Opis                 |
| -------------------- | ------------- | ------------------------------------------------- | -------------------- |
| 1 bot                | **17 znaków** | `ZOO` + 13 znaków (sekwencja) + 1 znak (pozycja)  | `ZOO72b08391c64a55`  |
| 2 boty (jedna talia) | **19 znaków** | `ZOO` + 13 znaków + 1 znak + 2 znaki (boty: n+nr) | `ZOO72b08391c64a521` |
| 3 boty (jedna talia) | **19 znaków** | `ZOO` + 13 znaków + 1 znak + 2 znaki (boty: n+nr) | `ZOO72b08391c64a532` |
| 4 boty (jedna talia) | **19 znaków** | `ZOO` + 13 znaków + 1 znak + 2 znaki (boty: n+nr) | `ZOO72b08391c64a543` |

---

## 🔍 Szczegóły implementacji

### Dla jednego bota (17 znaków)

**Format**: `ZOO[13-znakowa sekwencja kart][1-znakowa pozycja]`

**Przykład**: `ZOO72b08391c64a55`

- `ZOO` - prefix
- `72b08391c64a5` - przetasowana sekwencja 13 kart
- `5` - aktualna pozycja w talii (po 5. karcie, czyli indeks 5)

**Dekodowanie**:

1. Usunięcie prefixu `ZOO`
2. Podział na sekwencję (13 znaków) i pozycję (1 znak)
3. Konwersja każdego znaku na indeks karty (0-12)
4. Określenie użytych kart na podstawie aktualnej pozycji

### Dla wielu botów z jedną talią

**Format**: `ZOO[13-znakowa sekwencja kart][1-znakowa pozycja][liczba botów][numer aktualnego bota]`

**Specyfikacja**:

- **Znak 1**: Liczba botów (2-4) - tylko dla trybów wielobotowych
- **Znak 2**: Numer aktualnego bota (1-4) - tylko dla trybów wielobotowych
- **Uwaga**: 1 bot używa krótszego formatu (17 znaków) bez informacji o botach

**Przykłady**:

- `ZOO72b08391c64a521` - 2 boty, aktualny Bot 1
- `ZOO72b08391c64a522` - 2 boty, aktualny Bot 2
- `ZOO72b08391c64a532` - 3 boty, aktualny Bot 2
- `ZOO72b08391c64a544` - 4 boty, aktualny Bot 4

**Zalety**:

- Stała długość 19 znaków dla wszystkich trybów wielobotowych
- Intuicyjne numerowanie botów (1,2,3,4...)
- Jasne rozróżnienie liczby botów i aktualnego bota

---

## 💾 Zmiany w GameState

### Usunięte pola (v0.2.0 → v0.2.1)

```typescript
// USUNIĘTE z GameState:
shuffleCount: number; // Niepotrzebne - nie przechowujemy historii
gameStarted: boolean; // Niepotrzebne - istnienie kodu = gra rozpoczęta
```

### Aktualna struktura

```typescript
interface GameState {
  currentCardIndex: number; // Pozycja w talii (0-12)
  cardSequence: number[]; // Przetasowana sekwencja kart [0-12]
  usedCards: number[]; // Karty użyte w bieżącej rundzie
}
```

---

## 🎮 Zalety systemu

### Ultra-kompaktowość

- **90% redukcja** względem poprzednich systemów
- v0.2.0: ~175 znaków → v0.2.1: **17 znaków**

### Czytelność dla człowieka

- Brak mylących znaków (0/O, 1/l)
- Alfanumeryczne znaki łatwe do przepisania
- Krótkie kody możliwe do zapamiętania

### Cross-device compatibility

- Pełne dane wbudowane w kod
- Brak zależności od localStorage
- Działa między różnymi urządzeniami i przeglądarkami

### Skalowalność

- Eleganckie rozszerzenie dla wielu botów
- Auto-detect trybu gry
- Przygotowanie na przyszłe funkcje

---

## 🚫 Ograniczenia systemu

### Brak personalizacji

- Nie ma miejsca na niestandardowe imiona botów
- Boty nazywane generycznie: "Bot 1", "Bot 2", etc.

### Breaking change

- Brak wstecznej kompatybilności z v0.2.0
- Konieczność przepisania całego systemu save/load

### Tylko podstawowe dane

- Brak historii przetasowań
- Brak metadanych (timestamp, wersja, checksumy)

---

## 🔧 Implementacja techniczna

### Funkcje kodowania

```typescript
// Kodowanie indeksu karty (0-12) → symbol (1-9,a-d)
function encodeCard(cardIndex: number): string;

// Dekodowanie symbolu (1-9,a-d) → indeks karty (0-12)
function decodeCard(char: string): number;

// Generowanie kodu gry
function generateShareableCode(gameState: GameState): string;

// Wczytywanie stanu z kodu
function loadFromShareableCode(gameCode: string): GameState | null;
```

### Walidacja

- Sprawdzenie prefixu `ZOO`
- Walidacja długości kodu (17 znaków dla 1 bota)
- Walidacja znaków (tylko 1-9, A-C)
- Sprawdzenie poprawności indeksów kart

---

## 📊 Porównanie systemów

| System               | Długość       | Cross-device | Czytelność | Kompresja |
| -------------------- | ------------- | ------------ | ---------- | --------- |
| v0.2.0 JSON+Base64   | ~172 znaki    | ❌           | ❌         | -         |
| v0.2.0 LZ-String     | ~175 znaków   | ❌           | ❌         | Średnia   |
| v0.2.1 Ultra-compact | **17 znaków** | ✅           | ✅         | **90%**   |

---

## 🚀 Roadmapa

### v0.2.1 (current)

- ✅ Implementacja systemu dla 1 bota
- ✅ Cross-device functionality
- ✅ Ultra-compact codes

### v0.3.0 (planned)

- [ ] Wsparcie dla wielu botów z jedną talią
- [ ] Rozszerzenie systemu kodów

### v0.4.0 (planned)

- [ ] Osobne talie dla każdego bota
- [ ] Format kodów v2

---

_Dokumentacja systemu zapisu gry - Spółka ZOO Bot Pomocnik v0.2.1_

## 🧩 Propozycja użytkownika: zapis 'remaining-only' z wyróżnieniem aktualnej karty

Uwaga: poniżej znajduje się zapis pomysłu przesłany przez współpracownika — zachowuję oryginalną logikę, robię analizę i proponuję małe ujednolicenia. Celem jest: zapisywać jedynie to, co pozostało do dobrania, ale jednocześnie móc natychmiast pokazać aktualną kartę (ostatnio dobraną) dla bieżącego bota.

Podstawa (idea):

- Prefix zawsze zaczyna się od litery `Z`.
- Zapisujemy jedynie "remaining" (karty, które jeszcze będą dobierane) — oszczędza miejsce.
- Dla jednego bota zapis może być np. `ZS5` oznaczające: tryb Single (`S`), aktualna karta = `5`, i nie ma już kolejnej karty do dobrania (następna akcja to reshuffle).
- Dla wielu botów z jedną talią np. `ZM325` oznacza: `Z` `M` (multi-shared), `3` (liczba botów), `2` (aktualny bot), `5` (aktualna karta). Następnie w zależności od akcji kod może rozwinąć się do postaci zawierającej sekwencję pozostałych kart (np. po reshuffle): `ZM320123456789ABC` lub `ZM330123456789ABC`.

### Propozycja formatu per-bot (użytkownik): przykładowy zapis

- Przykład zaproponowany przez użytkownika: `ZP321Z5Z23Z678`
  - Rozbicie (interpretacja autora pomysłu):
    - `ZP` — prefix + per-bot mode
    - `3` — liczba botów (3)
    - `2` — aktualny bot (bot #2)
    - `1` — aktualna karta (dla bota #2 = karta 1)
    - `Z5` — dla bota #1: tylko karta `5` pozostała do dobrania
    - `Z23` — dla bota #2: pozostałe do dobrania karty `2` i `3`
    - `Z678` — dla bota #3: pozostałe do dobrania karty `6,7,8`

-### Analiza oryginalnego pomysłu — uwagi i reguła

- Reguła: CUR (aktualna karta bieżącego bota) podawana jest wyłącznie w nagłówku kodu; żaden z bloków SEQ_i nie powinien zawierać tej wartości. Poniżej przykładowy poprawny zapis i konsekwencje walidacyjne.
  - Przykład użytkownika: `ZP321Z5Z23Z678` (botCount=3, currentBot=2, CUR=1)
  - Konsekwencje dla parsera i walidacji:
  - Parser powinien wykrywać i odrzucać (lub normalizować) przypadki, w których CUR występuje także w SEQ_current — zalecane jest odrzucenie jako błąd wejściowy (i pokazanie użytkownikowi komunikatu o nieprawidłowym kodzie).
  - Każdy znak w blokach SEQ_i musi należeć do alfabetu kart (0-9, A-C).
  - Opcjonalnie: wymagać unikalności w obrębie każdego SEQ_i, aby ułatwić koherentne odtwarzanie stanu talii; brak tych warunków powinien skutkować przyjaznym błędem walidacji.

### Proponowane ujednolicenie (zalecane)

- Cel: zachować ideę użytkownika, ale usunąć redundancję i dać prosty parser.
- Reguła (proponowana):
  1. Po nagłówku `ZP` następuje: `N` (liczba botów 1..4), `C` (numer currentBota 1..N), `CUR` (symbol aktualnej karty bieżącego bota). CUR musi być symbolem karty z alfabetu (0-9, A-C). Nie używamy specjalnych sentinelów (np. `-`) ani rezerwujemy `0` jako oznaczenia „braku karty” — `0` oznacza kartę o indeksie 0. W praktyce po rozpoczęciu gry aktualna karta zawsze istnieje i zawsze należy ją podać.
  2. Następnie dla każdego bota (i = 1..N) czytamy blok poprzedzony literą separatora `Z` (łatwo rozpoznawalne). Każdy blok zawiera SEQ_i — sekwencję kart, które są nadal do dobrania dla tego bota **po** aktualnej karcie (tj. dla currentBota SEQ_current nie zawiera CUR; dla pozostałych botów SEQ_i to ich przyszłe karty — nie zawierają ich własnych aktualnych kart, bo zakładamy, że zostały już dobrane wcześniej).
  3. W ten sposób nie ma powtarzania symboli: aktualna karta bieżącego bota jest jednorazowo wskazana jako CUR, a jego blok SEQ_current zawiera karty które będą dobrane po tej aktualnej karcie.

Przykład z normalizacją (ta sama sytuacja, bez redundancji):

- Oryginalny: `ZP321Z5Z23Z678` (użytkownik)
- Normalizowany (zalecany): `ZP3 2 1 Z5 Z23 Z678` → bez spacji: `ZP321Z5Z23Z678`
  - Rozbicie: `ZP3` | `2` | `1` | `Z5` | `Z23` | `Z678`
  - Interpretacja: botCount=3, currentBot=2, currentCard=1; bot1 remaining=[5]; bot2 remaining=[2,3] (po aktualnej 1); bot3 remaining=[6,7,8].

### Parsowanie (proponowany algorytm)

1. Sprawdź prefix `ZP`.
2. Odczytaj `N` (1 znak) → botCount, `C` (1 znak) → currentBot, `CUR` (1 znak) → currentCardSymbol. CUR musi być symbolem karty z alfabetu (0-9, A-C); nie używamy sentinelów oznaczających "brak karty".
3. Iteracyjnie: dla i=1..N oczekujemy separator `Z`, potem sekwencję SEQ_i (ciąg 0..9,A..C o dowolnej długości, w tym zero). Czytamy dopóki nie natrafimy na następny separator `Z` lub koniec kodu (ostatni block kończy się przed końcowym currentBot jeżeli taki mamy w formie innego pola — w naszej konstrukcji currentBot i CUR są wcześniej, więc koniec blocków to koniec stringa).
4. Walidacja:
   - Każdy znak w SEQ_i musi należeć do alfabetu kart (0..9,A..C).
   - W SEQ_i nie powinno być duplikatów (to sekwencja pozostałych kart) — ale to zależy od przyjętej semantyki: jeśli chcemy być konserwatywni, wymagamy unikalności w obrębie SEQ_i.
   - Opcjonalnie: upewnić się, że zbiory SEQ_i i CUR (dla bieżącego bota) są spójne z przestrzenią kart (można obliczyć used = allSymbols \\ union(seq_i) \\ {CUR} ).

### Mapowanie do GameState

- Dla każdy bot i:
  - botDeck.cardSequence = decoded SEQ_i (array of indices)
  - Jeśli i === currentBot:
    - botDeck.currentCardIndex = 0
    - The current card value shown to the UI is CUR
    - Conceptually, UX: CUR is the last drawn card; SEQ_current are the following cards to be drawn.
  - Else:
    - botDeck.currentCardIndex = -1 (or 0 depending on UI convention) — but we assume the next draw for those bots will draw the first element of SEQ_i
    - Optionally: if SEQ_i is empty, that bot is exhausted and needs reshuffle before draw.

### Przykłady (po normalizacji) i ich sens

-- `ZP321Z5Z23Z678` (normalizowana wersja Twojego przykładu):

- 3 boty; currentBot=2; CUR=1
- Bot1 remaining: [5]
- Bot2 remaining: [2,3] (po aktualnej 1)
- Bot3 remaining: [6,7,8]

### Wady / zagrożenia / rzeczy do przemyślenia

- Walidacja musi być wyraźna: brak duplikatów wewnątrz SEQ_i, poprawne symbole, poprawna liczba bloków separatorów.
- UX edge-case: co jeśli CUR nie znajduje się w zbiorze {0..12} albo powtarza się w innych SEQ_j — to błąd kodu; reject with friendly message.

### Propozycja implementacji (krótkie kroki)

1. Dodać parser/generator dla formatu `ZP` w `src/utils/gameStorage.ts` (funkcje: encodePerBotRemaining, decodePerBotRemaining).
2. Zaimplementować normalizację przy generowaniu — nigdy nie generować redundantnych kodów (tj. nie powielać CUR w SEQ_current).
3. Zintegrować z UI: przy kopiowaniu stanu gry generować normalizowany format; przy wczytywaniu obsłużyć zarówno normalizowane, jak i (opcjonalnie) dopuszczać stare / redundacyjne warianty dla kompatybilności użytkownika.
4. Dodać testy jednostkowe dla parsera — roundtrip + invalid cases.

---

## ✅ Finalna semantyka formatów "remaining-only" (v0.4.x)

Poniżej zwięzłe, jednoznaczne reguły, które będą używane w implementacji i dokumentacji:

- Prefix: każdy "remaining-only" kod zaczyna się od litery `Z` i trybu (`P` = per-bot, `M` = multi-shared, `S` = single), np. `ZP`, `ZM`, `ZS`.
- Nagłówek (`ZP` dla per-bot): po prefiksie następują kolejno trzy pola składowe (po jednym znaku każdy):
  1. `N` — liczba botów (cyfra 1..4)
  2. `C` — numer currentBota (cyfra 1..N)
  3. `CUR` — symbol aktualnej karty bieżącego bota (z alfabetu kart: 0-9, A-C)
- Separatory bloków: po nagłówku oczekujemy dokładnie N bloków, każdy poprzedzony literą separatora `Z`. Separator `Z` jest obowiązkowy i ułatwia parsowanie oraz czytelność dla ludzi. Bloki są w kolejności bot1..botN i zawierają SEQ_i — sekwencję symboli kart (może być pusta).
- Zakaz sentinelów: nie używamy specjalnych sentinelowych symboli do oznaczania "braku karty" — `CUR` zawsze musi być symbol karty (0-9, A-C). W tym systemie aktualna karta zawsze istnieje i jest jawnie podana.
- Brak redundancji: CUR może występować tylko w nagłówku; blok SEQ_current nie powinien zawierać CUR. Wystąpienie CUR w właściwym bloku traktujemy jako błąd wejściowy i odrzucamy kod (parser powinien zgłosić przyjazny komunikat walidacyjny).
- Walidacja: każdy znak w SEQ_i musi należeć do alfabetu kart; opcjonalnie wymuszamy brak duplikatów w obrębie pojedynczego SEQ_i dla prostoty i spójności.

Przykład (per-bot): `ZP321Z5Z23Z678`

- Interpretacja: `ZP` | `3` (botCount) | `2` (currentBot) | `1` (CUR) | `Z5` (bot1 remaining) | `Z23` (bot2 remaining after CUR=1) | `Z678` (bot3 remaining)

---

## 🧩 Kompaktowanie długich kodów — binary → base64url (opcjonalne)

Gdy wygenerowany kod czytelny dla człowieka przekracza ~40 znaków, zalecamy opcjonalne utworzenie krótszej postaci binarnej zakodowanej w base64url. Uwaga: reguły automatycznego przełączania na format kompaktowy (np. próg ~40 znaków) są nadal w trakcie przemyśleń i nie stanowią wersji ostatecznej — opisany próg jest propozycją roboczą. Zasady:

- Reprezentacja binarna:
  - Zakoduj nagłówek jako 3 pola po 4 bity każde (wystarczające dla 0-15): N, C, CUR_index (0-12)
  - Każdy symbol karty w SEQ_i kodujemy na 4 bity (0..12)
  - Kolejność bitów: nagłówek (12 bitów), następnie kolejne bloki SEQ_1..SEQ_N bez dodatkowych separatorów; przed każdym bloku dopisz 4-bitową długość bloku (liczba symboli, 0..13). Dzięki temu odczyt jest deterministyczny.
- Pakowanie i kodowanie:
  - Zbiór bitów pakujemy MSB-first do bajtów (uzupełniamy ostatni bajt zerami jeśli potrzeba).
  - Zdekodowany strumień bajtów kodujemy w base64url (znaki `-` i `_`, bez `=` padding) i poprzedzamy headerem trybu, np. `ZP+` (gdzie `+` oznacza użycie formatu kompaktowego). Przykładowy prefiks: `ZP+`.
- Długość i odczyt:
  - Parser rozpoznaje prefiks `ZP+` (lub `ZM+`, `ZS+`) i dekoduje base64url, rozpakowuje bity zgodnie z opisanym układem i odtwarza SEQ_i.
  - Wersjonowanie: domyślnie nie dopisujemy oddzielnego numeru wersji (user requested), ale prefiks `+` rozróżnia postać kompaktową od czytelnej; jeżeli w przyszłości będzie potrzebna ewolucja, dopiszemy niewielki numer wersji w nagłówku kompaktowym.

Przykład: (ilustracyjny, wartości fikcyjne)

- Czytelny: `ZP321Z5Z23Z678` (23 znaki)
- Kompaktowy: `ZP+qK9fY` (8-12 znaki zależnie od zawartości)

---

Jeżeli potwierdzasz powyższe zasady, zaimplementuję w `src/utils/gameStorage.ts`:

1. `encodePerBotRemaining(gameState) -> string` — generuje normalizowany czytelny kod; jeśli wynik >40 zn., generuje także wersję kompaktową i zwraca ją zamiast długiej.
2. `decodePerBotRemaining(code: string) -> GameState | null` — rozpoznaje formę czytelną (`ZP...`) i kompaktową (`ZP+...`) i odtwarza stan lub zwraca `null` + informację o błędzie.
3. Zestaw prostych testów jednostkowych roundtrip i przypadki błędne (puste sekcje, duplikaty, CUR w bloku itd.).

---

Aktualizuję todo listę lokalnie — oznaczę zadanie dokumentacji jako zakończone.
