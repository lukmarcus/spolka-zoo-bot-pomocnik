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
