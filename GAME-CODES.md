# System zapisu gry - Spółka ZOO Bot Pomocnik

## 🎯 Status implementacji (v0.4.3)

| Format  | Status             | Opis                    | Użycie                                 |
| ------- | ------------------ | ----------------------- | -------------------------------------- |
| **ZS**  | ✅ Gotowy          | Single-Bot (czytelny)   | 1 bot, wspólna talia                   |
| **ZM**  | ✅ Gotowy          | Multi-Shared (czytelny) | 2-4 boty, wspólna talia                |
| **ZP**  | 🚧 W implementacji | Per-Bot (osobne talie)  | 2-4 boty, osobne talie per-bot         |
| **ZOO** | 🏛️ Legacy          | Format przestarzały     | Kompatybilność wsteczna (do usunięcia) |

---

## 🔧 Podstawy

**Talia:** 13 kart (indeksy 0-12)  
**Alfabet:** `0-9` (karty 0-9), `A-C` (karty 10-12) — duże litery  
**Logika:** "remaining-only" — kod zawiera obecną kartę + pozostałe do dobrania  
**Format:** Human-readable, bez kompresji binarnej  
**Auto-detect:** Rozpoznawanie po prefiksie (`ZS`, `ZM`, `ZP`, `ZOO`)

**Mapowanie:** 0→0, 1→1, ..., 9→9, 10→A, 11→B, 12→C

---

## 📝 Formaty kodów gry

### Format ZS - Single Bot (1 bot)

**Status:** ✅ Zaimplementowany (v0.4.1)

**Struktura:** `ZS[obecna_karta][pozostałe_karty...]`

**Opis:** Pojedynczy bot z jedną talią. Kod zawiera obecną kartę + pozostałe karty do dobrania.

**Przykłady:**

- `ZS5AC278B6413` - obecna: karta 5, pozostałe: A,C,2,7,8,B,6,4,1,3 (pozycja 3/13)
- `ZSC` - obecna: karta C(12), brak pozostałych (pozycja 13/13)
- `ZS0123456789ABC` - obecna: karta 0, wszystkie pozostałe (pozycja 1/13)

---

## 📋 Format ZM - Multi Shared (v0.4.2)

**Status:** ✅ Wdrożony w v0.4.2

**Struktura:** `ZM[n_botów][aktualny_bot][obecna_karta][pozostałe_karty...]`

**Opis:** Wielu botów dzieli wspólną talię. Wszyscy botowie dobierają z tej samej sekwencji kart.

**Przykład:** `ZM325AC278B6413`

- **ZM** - prefix Multi-Shared
- **3** - liczba botów (2-4)
- **2** - aktualny bot (indeks 1-based)
- **5** - obecna karta aktualnego bota
- **AC278B6413** - pozostałe karty we wspólnej talii (do dobrania przez wszystkich botów)

**Walidacja:**

- Prefix musi być `ZM`
- Liczba botów: 2-4 (cyfra)
- Aktualny bot: 1 do N (cyfra)
- Obecna karta: 0-9,A-C (symbol karty)
- Pozostałe karty: 0-9,A-C (sekwencja symboli)
- Brak duplikatów w pozostałych kartach
- Obecna karta nie może wystąpić w pozostałych kartach

---

## 🎯 Format ZP - Per-Bot (v0.4.3)

**Status:** 🚧 W trakcie implementacji

**Struktura:** `ZP[n_botów][aktualny_bot][obecna_karta]Z[bot1_pozostałe]Z[bot2_pozostałe]Z...`

**Opis:** Każdy bot ma własną, niezależną talię. Każdy bot może być w innym stanie gry (różna liczba pozostałych kart).

### Szczegóły formatu

**Nagłówek (5 znaków):**

- `ZP` - prefix Per-Bot
- `N` - liczba botów (cyfra 2-4)
- `C` - aktualny bot (cyfra 1-N)
- `CUR` - obecna karta aktualnego bota (symbol 0-9,A-C)

**Bloki per-bot (każdy poprzedzony separatorem `Z`):**

- `Z[bot1_pozostałe]` - pozostałe karty bota 1 (może być pusta)
- `Z[bot2_pozostałe]` - pozostałe karty bota 2 (może być pusta)
- `Z[bot3_pozostałe]` - pozostałe karty bota 3 (może być pusta, jeśli 3 boty)
- itd.

### Przykłady

**Przykład 1:** `ZP321Z5Z23Z678`

- 3 boty, aktualny bot 2, jego obecna karta: 1
- Bot 1: pozostałe karty [5]
- Bot 2: pozostałe karty [2,3] (po obecnej karcie 1)
- Bot 3: pozostałe karty [6,7,8]

**Przykład 2:** `ZP31AZ012Z4567Z89BC`

- 3 boty, aktualny bot 1, jego obecna karta: A(10)
- Bot 1: pozostałe [0,1,2]
- Bot 2: pozostałe [4,5,6,7]
- Bot 3: pozostałe [8,9,B,C]

### Reguły walidacji

1. **Struktura podstawowa:**

   - Prefix musi być dokładnie `ZP`
   - Liczba botów N: 2-4 (cyfra)
   - Aktualny bot C: 1 do N (cyfra, musi być w zakresie)
   - Obecna karta CUR: 0-9,A-C (symbol karty)

2. **Bloki per-bot:**

   - Musi być dokładnie N bloków (każdy poprzedzony `Z`)
   - Każdy blok może być pusty (bot wyczerpał talię)
   - Znaki w blokach: tylko 0-9,A-C
   - Brak duplikatów w obrębie jednego bloku

3. **Reguła redundancji:**

   - Obecna karta CUR NIE MOŻE występować w bloku aktualnego bota
   - CUR jest już dobrana, więc nie może być w "pozostałych"
   - Jeśli CUR wystąpi w bloku currentBot → BŁĄD walidacji

4. **Separatory:**
   - Dokładnie N separatorów `Z` (po jednym przed każdym blokiem)
   - Separator `Z` ułatwia parsowanie i czytelność
   - Brak separatora lub za mało separatorów → BŁĄD

### Plan implementacji ZP (v0.4.3)

#### Krok 1: Funkcje encode/decode w gameStorage.ts

**Do zrobienia:**

- Dodać `encodePerBotReadable(gameState: GameState): string`
- Dodać `decodePerBotPayload(payload: string): GameState | null`
- Dodać walidację: reguła redundancji (CUR nie w bloku currentBot)
- Dodać walidację: liczba separatorów, zakres botCount/currentBot
- Dodać walidację: duplikaty w blokach, nieprawidłowe znaki

#### Krok 2: Integracja z generateShareableCode()

**Do zrobienia:**

- Dodać sprawdzenie: `if (mode === 'individual' && botDecks)`
- Wywołać `encodePerBotReadable(gameState)` zamiast fallback do ZOO
- Zachować kompatybilność z ZS (1 bot) i ZM (shared mode)

#### Krok 3: Integracja z loadFromShareableCode()

**Do zrobienia:**

- Dodać pattern match dla kodu ZP: `/^ZP[2-4][1-4][0-9A-C]Z/`
- Wywołać `decodePerBotPayload(code)` dla kodów ZP
- Zwrócić `null` + błąd dla nieprawidłowych kodów ZP
- Zachować obsługę ZS, ZM, ZOO (backward compatibility)

#### Krok 4: Wsparcie LoadGameModal

**Do zrobienia:**

- Dodać filtr znaków dla ZP: `0-9A-CZ` (separator Z)
- Dodać preview dla kodów ZP (pokazać stan per-bot)
- Dodać komunikaty błędów dla ZP:
  - "Obecna karta nie może być w bloku pozostałych"
  - "Nieprawidłowa liczba bloków (oczekiwano N, znaleziono M)"
  - "Duplikaty w bloku bota X"
  - "Aktualny bot poza zakresem (1-N)"

#### Krok 5: Testy

**Do zrobienia:**

- Test roundtrip: encode → decode → porównaj GameState
- Test edge case: puste bloki (boty wyczerpane)
- Test edge case: wszystkie 13 kart w bloku
- Test walidacji: CUR w bloku currentBot (should reject)
- Test walidacji: duplikaty w bloku (should reject)
- Test walidacji: za mało/za dużo bloków (should reject)
- Test walidacji: currentBot poza zakresem (should reject)
- Test backward compatibility: stare kody ZS/ZM nadal działają

---

## 🏛️ Format ZOO - Legacy

**Status:** ⚠️ Wycofywany (backward compatibility only)

**Struktura:** `ZOO[13_kart][pozycja][n_botów][aktualny_bot]` (19 znaków)

**Opis:** Stary format z pełną sekwencją 13 kart i pozycją. Używa dużych liter A-C (zamiast małych a-c).

**Uwaga:** Format ZOO jest wspierany tylko do wczytywania starych kodów. Nowe kody są generowane w formatach ZS/ZM/ZP.

**Przykład:** `ZOO72B08391C64A5521`

- 13 kart: 7,2,B,0,8,3,9,1,C,6,4,A,5
- Pozycja: 5
- Liczba botów: 2
- Aktualny bot: 1

---

## 📋 Checklist testów dla ZP

### Testy podstawowe

- [ ] Encode state z 2 botami → decode → porównaj
- [ ] Encode state z 3 botami → decode → porównaj
- [ ] Encode state z 4 botami → decode → porównaj
- [ ] Encode state z pustym blokiem (bot wyczerpany) → decode → porównaj

### Testy walidacji (should reject)

- [ ] CUR występuje w bloku currentBot
- [ ] Duplikaty w jednym bloku
- [ ] Za mało bloków (N-1 zamiast N)
- [ ] Za dużo bloków (N+1 zamiast N)
- [ ] currentBot = 0 (poza zakresem)
- [ ] currentBot > botCount (poza zakresem)
- [ ] botCount = 1 (minimum to 2)
- [ ] botCount = 5 (maksimum to 4)
- [ ] Nieprawidłowe znaki w bloku (np. 'X', 'D')
- [ ] Brak separatora Z przed blokiem
- [ ] Prefix inny niż 'ZP'

### Testy edge case

- [ ] Wszystkie bloki puste (wszyscy wyczerpani)
- [ ] Jeden blok z 12 kartami (najdłuższy możliwy)
- [ ] currentBot z pustym blokiem (wyczerpał talię)
- [ ] Kod z pojedynczymi kartami w każdym bloku

### Testy backward compatibility

- [ ] Kod ZS nadal działa
- [ ] Kod ZM nadal działa
- [ ] Kod ZOO nadal działa (wczytywanie)
- [ ] generateShareableCode() wybiera właściwy format (ZS/ZM/ZP)
