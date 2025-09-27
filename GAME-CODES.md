# System zapisu gry - Spółka ZOO Bot Pomocnik

## 📖 Specyfikacja systemu kodów gry v0.4.1

Kody gry używają czytelnego formatu "remaining-only" - zapisują tylko obecną kartę i karty pozostałe do dobrania.

### 🎯 **Status implementacji (v0.4.1):**

- **✅ ZS Single-Bot**: Aktywny system dla jednego bota (human-readable)
- **✅ ZOO Legacy**: Pełne wsparcie dla kompatybilności wstecznej
- **🚧 ZM Multi-Shared**: W przygotowaniu (v0.4.2)
- **🚧 ZP Per-Bot**: W przygotowaniu (v0.4.3)

### 🗓️ **Roadmapa 0.4.x:**

- **v0.4.1** - Finalizacja ZS + dokumentacja
- **v0.4.2** - Implementacja ZM (Multi-Shared)
- **v0.4.3** - Implementacja ZP (Per-Bot)
- **v0.4.4** - Comprehensive tests + finalizacja

---

## 🔧 Architektura systemu

### Podstawowe założenia

- **Talia**: 13 kart oznaczonych indeksami 0-12
- **Alfabet**: Znaki 0-9 (indeksy 0-9) oraz A-C (indeksy 10-12) - duże litery!
- **Zakres botów**: Obecnie 1 bot, planowane 2-4 boty
- **Logika "remaining-only"**: Kod zawiera obecną kartę + pozostałe do dobrania
- **Brak kompresji**: Czytelny format dla człowieka (no compression, no binary packing)
- **Auto-detect**: Rozpoznawanie formatu na podstawie prefiksu

### Mapowanie indeksów kart

```
Indeks karty → Symbol
0 → 0     7 → 7
1 → 1     8 → 8
2 → 2     9 → 9
3 → 3    10 → A  ← duże litery!
4 → 4    11 → B  ← duże litery!
5 → 5    12 → C  ← duże litery!
6 → 6
```

---

## ✅ **Aktualny stan v0.4.1**

### 🎯 **Zaimplementowane funkcje:**

**Walidacja kodów:**

- ✅ Sprawdzenie unikalności kart (brak duplikatów)
- ✅ Walidacja zakresu kart (0-12, automatic via decoding)
- ✅ Kontrola liczby kart (1-13 w sekwencji)
- ✅ Brak stanów ujemnych lub 0/13
- ✅ Auto-detection formatu (ZS vs ZOO)

**User Interface:**

- ✅ Real-time validation w LoadGameModal
- ✅ Preview stanu gry (pozycja X/13)
- ✅ Proper error messages dla każdego formatu
- ✅ Usunięto niepotrzebny komunikat o wyczerpaniu talii

**Format Support:**

- ✅ ZS Single-Bot (pełna implementacja)
- ✅ ZOO Legacy (backward compatibility)
- 🚧 ZM Multi-Shared (planowane v0.4.2)
- 🚧 ZP Per-Bot (planowane v0.4.3)

---

## 📝 Formaty kodów gry

### 🎯 **Aktualny system (v0.4.1 - pełna implementacja)**

#### Format ZS - Single Bot (jeden bot)

_Status: ✅ Gotowy do użycia_

**Struktura:** `ZS[obecna_karta][pozostałe_karty...]`

- **Prefix**: `ZS` (Single bot)
- **Obecna karta**: 1 znak (0-9,A-C) - karta obecnie wyciągnięta
- **Pozostałe karty**: 0-12 znaków - karty jeszcze do dobrania
- **Długość**: 3-15 znaków (dynamiczna, zależna od postępu gry)

**Walidacja v0.4.1:**

- ✅ Brak duplikatów kart (np. `ZS66666` odrzucane)
- ✅ Zakres kart 0-12 (automatic via alphabet)
- ✅ Kontrola liczby kart 1-13 total
- ✅ Brak stanów ujemnych lub pustych

**Przykłady:**

- `ZS5AC278B6413` - obecna: karta 5, pozostałe: A,C,2,7,8,B,6,4,1,3 (pozycja 3/13)
- `ZSC` - obecna: karta C(12), brak pozostałych (pozycja 13/13)
- `ZS0123456789ABC` - obecna: karta 0, wszystkie pozostałe (pozycja 1/13)

### � **Systemy w przygotowaniu (v0.4.2-0.4.3)**

#### Format ZM - Multi Shared (v0.4.2)

_Wielu botów, wspólna talia - planowane na v0.4.2_

**Struktura:** `ZM[n_botów][aktualny_bot][obecna_karta][pozostałe_karty...]`

**Przykład:** `ZM325AC278B6413`

- **ZM** - prefix Multi-Shared
- **3** - liczba botów (2-4)
- **2** - aktualny bot (1-based)
- **5** - obecna karta bota 2
- **AC278B6413** - pozostałe karty we wspólnej talii

#### Format ZP - Per-Bot (v0.4.3)

_Każdy bot osobną talią - planowane na v0.4.3_

**Struktura:** `ZP[n_botów][aktualny_bot][obecna_karta]Z[bot1_karty]Z[bot2_karty]Z[bot3_karty]...`

**Przykład:** `ZP321Z5Z23Z678`

- **ZP** - prefix Per-Bot
- **3** - liczba botów (2-4)
- **2** - aktualny bot (1-based)
- **1** - obecna karta bota 2
- **Z5** - bot 1: pozostałe karty [5]
- **Z23** - bot 2: pozostałe karty [2,3] (po obecnej 1)
- **Z678** - bot 3: pozostałe karty [6,7,8]

### 🏛️ **Legacy Format (v0.4.1 - pełne wsparcie)**

#### Format ZOO - Stary system

_Pełna kompatybilność wsteczna - czytanie starych kodów_

**Struktura:** `ZOO[13_kart][pozycja][n_botów][aktualny_bot]` (19 znaków)

**Status v0.4.1:** ✅ Pełne wsparcie dla wczytywania

- **Dekodowanie**: Pełna implementacja
- **Walidacja**: Sprawdzenie formatu i długości
- **Preview**: Pokazuje stan gry z kodem ZOO
- **Loading**: Konwersja do aktualnego GameState

**Przykład:** `ZOO72B08391C64A5521`

- Wspierany dla wczytywania starych kodów
- Automatyczna konwersja do nowego formatu przy zapisie

---

## 🔍 Szczegóły implementacji

### Format ZS - Aktualny system (v0.4.1)

**Logika "remaining-only"**: Kod zawiera tylko obecną kartę + karty jeszcze do dobrania

**Struktura**: `ZS[obecna_karta][pozostałe_karty...]`

**Przykład analizy kodu**: `ZS5ac278b6413`

1. **Prefix**: `ZS` → Single bot format
2. **Obecna karta**: `5` → Bot ma obecnie kartę o indeksie 5
3. **Pozostałe karty**: `ac278b6413` → Do dobrania: [10,12,2,7,8,11,6,4,1,3]
4. **Pozycja w grze**: 13 - (1+10) = 2 karty już wyciągnięte wcześniej → **pozycja 3/13**

**Zalety**:

- **Dynamiczna długość**: 3-15 znaków (krótszy kod = dalszy postęp gry)
- **Czytelność**: Alfabet 0-9,a-c bez mylących znaków
- **Oszczędność**: Tylko potrzebne informacje, bez historii

### Format ZOO - Legacy (kompatybilność wsteczna)

**Struktura**: `ZOO[13_kart][pozycja][n_botów][aktualny_bot]` (19 znaków stałe)

**Przykład**: `ZOO72b08391c64a5523`

- 2 boty, aktualny Bot 3, pozycja 5, pełna sekwencja 13 kart

**Uwaga**: Format ZOO wspierany tylko do wczytywania starych kodów

---

## 🎮 Zalety aktualnego systemu ZS

### Oszczędność i czytelność

- **Dynamiczna długość**: 3-15 znaków (vs. stałe 19 w ZOO)
- **Human-readable**: Alfabet 0-9,a-c bez mylących znaków (0/O, 1/l)
- **Brak kompresji**: Czytelne dla człowieka (zgodnie z wymaganiami użytkownika)

### Cross-device compatibility

- Pełne dane wbudowane w kod
- Brak zależności od localStorage
- Działa między różnymi urządzeniami i przeglądarkami

### Logiczna semantyka

- **"Remaining-only"**: Kod zawiera tylko to co potrzebne
- **Postęp gry = długość kodu**: Krótszy kod = dalszy postęp
- **Intuicyjne**: Pierwsza karta = obecna, reszta = do dobrania

---

## 🔧 Implementacja techniczna

### Funkcje kodowania (v0.4.1)

```typescript
// Kodowanie indeksu karty (0-12) → symbol (0-9,a-c)
function encodeCard(cardIndex: number): string;

// Dekodowanie symbolu (0-9,a-c) → indeks karty (0-12)
function decodeCard(char: string): number;

// Generowanie kodu gry (ZS dla 1 bota, ZOO dla legacy)
function generateShareableCode(gameState: GameState): string;

// Wczytywanie stanu z kodu (obsługuje ZS i ZOO)
function loadFromShareableCode(gameCode: string): GameState | null;

// Podgląd kodu przed wczytaniem
function previewGameCode(code: string): GameCodePreview;

// Sprawdzenie poprawności kodu
function isValidGameCode(code: string): boolean;
```

### Walidacja

- **Format ZS**: prefix `ZS` + znaki 0-9,a-c, długość 3-15 znaków
- **Format ZOO**: prefix `ZOO` + 16 znaków danych, łącznie 19 znaków
- **Alfabety**: ZS używa 0-9,a-c; ZOO używa 0-9,A-C (duże litery)
- **Auto-detect**: rozpoznawanie formatu po prefiksie

---

## 📊 Porównanie formatów

| Format  | Status       | Długość       | Czytelność      | Użycie                     |
| ------- | ------------ | ------------- | --------------- | -------------------------- |
| **ZS**  | ✅ Aktualny  | 3-15 znaków   | ✅ Bardzo dobra | 1 bot (remaining-only)     |
| **ZOO** | 🏛️ Legacy    | 19 znaków     | ⚠️ Średnia      | Multi-bot (kompatybilność) |
| **ZM**  | 🔮 Planowany | ~6-18 znaków  | ✅ Dobra        | Multi-bot, wspólna talia   |
| **ZP**  | 🔮 Planowany | ~15-40 znaków | ✅ Dobra        | Multi-bot, osobne talie    |

---

## 🚀 Roadmapa

### v0.4.1 (current)

- ✅ Format ZS dla jednego bota (remaining-only)
- ✅ Legacy ZOO support dla kompatybilności
- ✅ Human-readable alphabet (0-9,a-c)
- ✅ Cross-device functionality

### v0.5.0 (planned)

- [ ] Format ZM - multi-bot wspólna talia
- [ ] Rozszerzona walidacja i preview

### v0.6.0 (planned)

- [ ] Format ZP - per-bot osobne talie
- [ ] Pełny multi-bot system

---

## 🧩 Przyszłe formaty - planowane rozszerzenia

Poniżej opis przyszłych formatów dla wielu botów, które będą implementowane w kolejnych wersjach.

### Format ZM - Multi Shared (wspólna talia)

**Idea**: Wielu botów dzieli jedną talię, podobnie do obecnego systemu ZS.

**Struktura**: `ZM[n_botów][aktualny_bot][obecna_karta][pozostałe_karty...]`

**Przykłady**:

- `ZM325ac278b6413` - 3 boty, aktualny bot 2, obecna karta 5, pozostałe karty
- `ZM21c` - 2 boty, aktualny bot 1, obecna karta c(12), końcówka gry

### Format ZP - Per-Bot (osobne talie)

**Idea**: Każdy bot ma własną talię w różnym stanie zaawansowania.

**Struktura**: `ZP[n_botów][aktualny_bot][obecna_karta]Z[bot1_karty]Z[bot2_karty]Z[bot3_karty]...`

**Przykład**: `ZP321Z5Z23Z678`

- **Nagłówek**: `ZP321` → 3 boty, aktualny bot 2, jego obecna karta 1
- **Bot 1**: `Z5` → pozostała do dobrania karta 5
- **Bot 2**: `Z23` → pozostałe karty 2,3 (po obecnej karcie 1)
- **Bot 3**: `Z678` → pozostałe karty 6,7,8

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

## 🗓️ **Roadmapa rozwoju 0.4.x**

### **v0.4.1 (Current) - Stabilizacja ZS**

**Status:** 🎯 Aktywny development

**✅ Ukończone:**

- ZS Single-Bot format z A,B,C alphabet
- Walidacja: duplikaty, zakresy, stany ujemne
- UI: LoadGameModal z proper validation
- ZOO Legacy: pełne wsparcie backward compatibility
- Usunięcie komunikatu o wyczerpaniu talii
- Dokumentacja: aktualizacja GAME-CODES.md

**🚧 W toku:**

- Finalizacja dokumentacji
- Package.json update do v0.4.1

---

### **v0.4.2 - ZM Multi-Shared Implementation**

**Timeline:** ~3-4 dni po v0.4.1

**Planowane funkcje:**

- **ZM Format:** `ZM[bots][current][card][remaining]`
- **Parsing:** Rozszerzenie gameStorage.ts o ZM support
- **Validation:** Multi-bot validation logic
- **UI:** LoadGameModal update dla ZM preview
- **Tests:** Basic round-trip tests dla ZM

**Przykład:** `ZM325AC278B6413` (3 boty, aktualny=2, obecna=5)

---

### **v0.4.3 - ZP Per-Bot Implementation**

**Timeline:** ~3-4 dni po v0.4.2

**Planowane funkcje:**

- **ZP Format:** `ZP[bots][current][card]Z[bot1]Z[bot2]Z...`
- **Complex Parsing:** Z-separator logic
- **Per-Bot Logic:** Independent deck management
- **Advanced Validation:** Cross-bot validation
- **UI:** Complete ZP support w LoadGameModal

**Przykład:** `ZP321Z5Z23Z678` (3 boty, per-bot sequences)

---

### **v0.4.4 - Comprehensive Tests & Finalization**

**Timeline:** ~2-3 dni po v0.4.3

**Planowane funkcje:**

- **Unit Tests:** Wszystkie formaty (ZS, ZOO, ZM, ZP)
- **Edge Cases:** Boundary conditions, error handling
- **Performance:** Optimization dla większej liczby botów
- **Cross-Format:** Compatibility tests
- **Final Polish:** UI/UX improvements, final docs

---

### **🎯 Harmonogram całkowity:**

```
v0.4.1 (1-2 dni)   ── Finalizacja ZS + docs
v0.4.2 (3-4 dni)   ── ZM Multi-Shared
v0.4.3 (3-4 dni)   ── ZP Per-Bot
v0.4.4 (2-3 dni)   ── Tests + finalizacja
═══════════════════════════════════════════
v0.4.4 Complete     (2 tygodnie total)
```

**🚀 Rezultat v0.4.4:**

- Kompletna implementacja wszystkich formatów
- Pełna backward compatibility
- Comprehensive test coverage
- Production-ready quality

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
