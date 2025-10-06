# Formaty kodów gry - Spółka ZOO Bot Pomocnik

## 🎯 Obsługiwane formaty

| Format | Opis         | Użycie                     |
| ------ | ------------ | -------------------------- |
| **ZS** | Single-Bot   | 1 bot                      |
| **ZM** | Multi-Shared | 2-4 boty, wspólna talia    |
| **ZP** | Per-Bot      | 2-4 boty, niezależne talie |

## 🔧 Podstawy

**Talia:** 13 kart (indeksy 0-12)  
**Alfabet:** `0-9` (karty 0-9), `A-C` (karty 10-12)  
**Mapowanie:** 0→0, 1→1, ..., 9→9, 10→A, 11→B, 12→C  
**Logika:** Kod zawiera obecną kartę + pozostałe karty do dobrania  
**Auto-detect:** Automatyczne rozpoznawanie po prefiksie (`ZS`, `ZM`, `ZP`)

---

## 📝 Format ZS - Single Bot

**Struktura:** `ZS[obecna_karta][pozostałe_karty...]`

**Opis:** Pojedynczy bot z jedną talią.

**Przykłady:**

- `ZS5AC278B6413` - obecna: karta 5, pozostałe: A,C,2,7,8,B,6,4,1,3
- `ZSC` - obecna: karta C(12), brak pozostałych (talia wyczerpana)
- `ZS0123456789ABC` - obecna: karta 0, wszystkie pozostałe (początek gry)

---

## 📋 Format ZM - Multi Shared

**Struktura:** `ZM[n_botów][aktualny_bot][obecna_karta]Z[pozostałe_karty...]`

**Opis:** Wielu botów dzieli wspólną talię. Wszyscy botowie dobierają z tej samej sekwencji kart.

**Przykład:** `ZM325Z4AC278B61`

- **ZM** - prefix Multi-Shared
- **3** - liczba botów (2-4)
- **2** - aktualny bot (1-N, gdzie N=liczba botów)
- **5** - obecna karta aktualnego bota
- **Z** - separator
- **4AC278B61** - pozostałe karty we wspólnej talii

---

## 🎯 Format ZP - Per-Bot

**Struktura:** `ZP[n_botów][aktualny_bot][obecna_karta]Z[bot1_pozostałe]Z[bot2_pozostałe]Z...`

**Opis:** Każdy bot ma własną, niezależną talię. Każdy bot może być w różnym stanie gry.

**Składnia:**

- `ZP` - prefix Per-Bot
- liczba botów (2-4)
- aktualny bot (1-N)
- obecna karta aktualnego bota
- `Z` - separator przed każdym blokiem
- bloki kart dla każdego bota (mogą być puste)

**Przykłady:**

`ZP321Z5Z23Z678`

- 3 boty, aktualny bot 2, obecna karta: 1
- Bot 1: pozostałe [5]
- Bot 2: pozostałe [2,3]
- Bot 3: pozostałe [6,7,8]

`ZP414Z7ZAZ8ZA`

- 4 boty, aktualny bot 1, obecna karta: 4
- Bot 1: pozostałe [7]
- Bot 2: pozostałe [A]
- Bot 3: pozostałe [8]
- Bot 4: pozostałe [A]

---

## ⚠️ Migracja ze starych kodów ZOO

Starsze kody w formacie ZOO (`ZOO...`) nie są już obsługiwane.
