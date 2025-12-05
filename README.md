# 🦁 Spółka ZOO - Bot Pomocnik

> Cyfrowy zamiennik kart botów dla gry planszowej "Spółka ZOO"

[![Version](https://img.shields.io/badge/version-0.5.6-blue.svg)](./package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

## ✨ Funkcjonalności

🤖 **Zarządzanie botami** - Obsługa 1-4 botów z niezależnymi taliami  
🎯 **Inteligentne akcje** - Automatyczna kolejność i dobieranie kart  
💾 **Zapisywanie stanu** - Kompaktowe kody gry z podglądem w stylu kart  
🔗 **Cross-device** - Kompatybilność między urządzeniami  
📱 **Responsywne UI** - Optymalizacja dla wszystkich ekranów (320px+)  
⚡ **Real-time validation** - Walidacja kodów w czasie rzeczywistym  
🎨 **Profesjonalny design** - Własne czcionki, logo Spółka ZOO i spójny system kart  
✨ **Nowoczesna typografia** - Trzy czcionki (ChillScript, RooneySans, MarvinRound)  
🃏 **Card-based interface** - Zunifikowany design w stylu sekcji kart botów  
🔍 **Optymalizacja SEO** - Meta tagi, Open Graph, Twitter Cards dla lepszego udostępniania  
🛡️ **Obsługa błędów** - Eleganckie zarządzanie błędami z możliwością przywracania  
♿ **Dostępność** - Przyciski zgodne z WCAG i etykiety dla czytników ekranu

## 🚀 Szybki start

```bash
# 1. Klonowanie repozytorium
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik

# 2. Instalacja zależności
npm install

# 3. Uruchomienie w trybie dev
npm run dev
# Aplikacja dostępna na http://localhost:5173
```

**Dostępne komendy:**

- `npm run dev` - Serwer deweloperski
- `npm run build` - Build produkcyjny
- `npm run lint` - Sprawdzenie jakości kodu

## 📖 Jak używać

### 🎮 Podstawy gry

1. **Rozpocznij grę** → Wybierz tryb i liczbę botów (1-4)
2. **Dobieranie kart** → Dwa inteligentne przyciski:
   - 🎯 Dobierz kartę dla aktualnego bota
   - 👥 Przełącz na następnego bota i dobierz kartę
3. **Tryby gry**:
   - **Wspólna talia** - wszyscy boty dobierają z tej samej sekwencji
   - **Osobne talie** - każdy bot ma niezależną talię

### 💾 Zapisywanie i udostępnianie

**Kopiowanie stanu:** Przycisk "Kopiuj stan gry" → krótki kod  
**Wczytywanie:** Menu główne → "Wczytaj grę" → wklej kod  
**Formaty kodów:** ZS (1 bot), ZM (wspólna talia), ZP (osobne talie)  
**Podgląd:** Real-time preview przed wczytaniem

### 🔗 Kompatybilność

✅ Cross-device - kody działają między urządzeniami  
✅ Real-time validation - błędy wykrywane na żywo

## 🛠️ Technologie

**Frontend:** React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19  
**Stylowanie:** CSS Modules + CSS Variables + Responsywny Design  
**Routing:** React Router DOM 7.8.1  
**Architektura:** Context API + Reducer Pattern + Obsługa błędów  
**Wydajność:** React.memo, optymalizacje useCallback + preładowanie czcionek  
**Jakość:** Dostępność WCAG + optymalizacja SEO

## 📚 Dokumentacja

| Dokument                          | Opis                                     |
| --------------------------------- | ---------------------------------------- |
| [🗺️ ROADMAP.md](ROADMAP.md)       | Plany rozwoju i przyszłe funkcjonalności |
| [📜 CHANGELOG.md](CHANGELOG.md)   | Historia zmian i release notes           |
| [🎮 GAME-CODES.md](GAME-CODES.md) | Formaty kodów gry i instrukcje           |

## 🏗️ Architektura

```
src/
├── components/
│   ├── game/                    # Rozgrywka
│   │   ├── Game.tsx            # Router: Setup ↔ Play
│   │   ├── GameSetup.tsx       # Konfiguracja botów
│   │   └── GamePlay.tsx        # Aktywna rozgrywka
│   └── ui/                     # Interfejs
│       ├── Home.tsx            # Menu główne
│       ├── LoadGame.tsx        # Wczytywanie gry
│       ├── About.tsx           # Strona informacyjna
│       ├── Layout.tsx          # Layout aplikacji
│       └── ConfirmModal.tsx    # Modalne okna
├── lib/                        # Logika
│   ├── GameContext.tsx         # Stan gry (Context API)
│   ├── botCards.ts            # Dane kart (13 kart)
│   ├── gameStorage.ts         # Kody gry (ZS/ZM/ZP)
│   └── types.ts               # TypeScript typy
└── assets/                    # Zasoby
    ├── fonts/                 # Czcionki (3 rodziny)
    └── images/               # Ikony i tła
```

**TypeScript Path Mapping:**

- `@lib/*` → `src/lib/*` (logika, context, typy)
- `@ui/*` → `src/components/ui/*` (interfejs)
- `@game/*` → `src/components/game/*` (rozgrywka)

---

<div align="center">

**Autor:** [Marek Szumny](https://github.com/lukmarcus) · **Licencja:** MIT  
🌟 [Give it a star](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik) jeśli ci pomogło!

</div>
