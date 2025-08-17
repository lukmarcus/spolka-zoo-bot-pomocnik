# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
projekt stosuje [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Nie wydane]

### Planowane w wersji 0.1.0

- Mechanika kart botów (Lorem Ipsum)
- Ekran gry z jednym botem
- Dobieranie kart i przetasowanie

## [0.0.2] - 2025-08-17

### Naprawione

- 🐛 **Layout viewport issues**: Naprawiono urwane tło na dole ekranu (`background-attachment: fixed`, `100dvh`)
- 🐛 **Content overflow**: Poprawiono wyświetlanie na małych ekranach - zawartość nie była w pełni widoczna
- 🐛 **Responsywność czcionek**: Zastąpiono stałe rozmiary czcionek responsywnymi (`clamp()`)
- 🐛 **Padding na małych ekranach**: Dodano responsywny padding dla urządzeń <380px

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
