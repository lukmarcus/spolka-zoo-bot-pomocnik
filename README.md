# 🦁 Spółka ZOO - Bot Pomocnik

> Cyfrowy zamiennik kart botów dla gry planszowej "Spółka ZOO"

[![Version](https://img.shields.io/badge/version-0.4.5-blue.svg)](./package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

## ✨ Funkcjonalności

🤖 **Zarządzanie botami** - Obsługa 1-4 botów z niezależnymi taliami  
🎯 **Inteligentne akcje** - Automatyczna kolejność i dobieranie kart  
💾 **Zapisywanie stanu** - Kompaktowe kody gry z podglądem  
🔗 **Cross-device** - Kompatybilność między urządzeniami  
📱 **Responsywne UI** - Optymalizacja dla wszystkich ekranów (320px+)  
⚡ **Real-time validation** - Walidacja kodów w czasie rzeczywistym  
🎨 **Profesjonalny design** - Własny favicon i dynamiczne tytuły

## 🚀 Szybki start

```bash
# Klonowanie i instalacja
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik
npm install

# Uruchomienie
npm run dev
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

## �️ Technologie

**Frontend:** React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19  
**Styling:** CSS Modules + Responsive Design  
**Routing:** React Router DOM 7.8.1  
**Architecture:** Context API + Reducer Pattern

## �📚 Dokumentacja

| Dokument                          | Opis                                     |
| --------------------------------- | ---------------------------------------- |
| [� ROADMAP.md](ROADMAP.md)        | Plany rozwoju i przyszłe funkcjonalności |
| [📜 CHANGELOG.md](CHANGELOG.md)   | Historia zmian i release notes           |
| [🎮 GAME-CODES.md](GAME-CODES.md) | Formaty kodów gry i instrukcje           |

## 🤝 Rozwój projektu

**Aktualna wersja:** 0.4.5 (UX Fixes)  
**Status:** Stabilny - gotowy do użycia

---

<div align="center">

**Autor:** [Marek Szumny](https://github.com/lukmarcus) · **Licencja:** MIT  
🌟 [Give it a star](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik) jeśli ci pomogło!

</div>
