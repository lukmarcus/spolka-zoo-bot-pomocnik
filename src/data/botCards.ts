// Bot Cards Data - Spółka ZOO Bot Helper
// Real card content from Spółka ZOO board game

import type { BotCard } from "../types";

// Real Spółka ZOO cards (13 cards total)
export const BOT_CARDS: BotCard[] = [
  {
    id: 1,
    effects: [
      "Kup najtańszy <span style='color: #FFFFFF; font-weight: bold;'>OWOC</span> z <span style='color: #FFFFFF; font-weight: bold;'>MAGAZYNU</span>. Jeśli danego <span style='color: #FFFFFF; font-weight: bold;'>OWOCU</span> nie ma w <span style='color: #FFFFFF; font-weight: bold;'>MAGAZYNIE</span>, odkup go od innego gracza (pierwszego z lewej, który ma ten <span style='color: #FFFFFF; font-weight: bold;'>OWOC</span> w swojej puli).",
      "Kup najtańszy <span style='color: #FFFFFF; font-weight: bold;'>OWOC</span> z <span style='color: #FFFFFF; font-weight: bold;'>MAGAZYNU</span>. Jeśli danego <span style='color: #FFFFFF; font-weight: bold;'>OWOCU</span> nie ma w <span style='color: #FFFFFF; font-weight: bold;'>MAGAZYNIE</span>, odkup go od innego gracza (pierwszego z lewej, który ma ten <span style='color: #FFFFFF; font-weight: bold;'>OWOC</span> w swojej puli).",
    ],
    ability:
      "Jeśli kupiłeś przynajmniej 1 <span style='color: #FFFFFF; font-weight: bold;'>OWOC</span>, dobierz 3<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 2,
    effects: [
      "Zatrudnij <span style='color: #D14019; font-weight: bold;'>POMOCNIKA</span>.",
      "Przełóż jawnie wierzchnią <img src='/src/assets/images/interface/card.png' alt='karta' class='card-icon' /> z <span style='color: #77812B; font-weight: bold;'>TALII SPÓŁKI</span> <img src='/src/assets/images/interface/lemon.png' alt='cytryna' class='card-icon' /> na wierzch <span style='color: #77812B; font-weight: bold;'>TALII SPÓŁKI</span> <img src='/src/assets/images/interface/pineapple.png' alt='ananas' class='card-icon' />.",
    ],
    ability:
      "Dobierz 3<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 3,
    effects: [
      "Zatrudnij <span style='color: #D14019; font-weight: bold;'>POMOCNIKA</span>.",
      "Przełóż jawnie wierzchnią <img src='/src/assets/images/interface/card.png' alt='karta' class='card-icon' /> z <span style='color: #77812B; font-weight: bold;'>TALII SPÓŁKI</span> <img src='/src/assets/images/interface/apple.png' alt='jabłko' class='card-icon' /> na wierzch <span style='color: #77812B; font-weight: bold;'>TALII SPÓŁKI</span> <img src='/src/assets/images/interface/lemon.png' alt='cytryna' class='card-icon' />.",
    ],
    ability:
      "Dobierz 3<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 4,
    effects: [
      "Zatrudnij <span style='color: #D14019; font-weight: bold;'>POMOCNIKA</span>.",
      "Przełóż jawnie wierzchnią <img src='/src/assets/images/interface/card.png' alt='karta' class='card-icon' /> z <span style='color: #77812B; font-weight: bold;'>TALII SPÓŁKI</span> <img src='/src/assets/images/interface/pineapple.png' alt='ananas' class='card-icon' /> na wierzch <span style='color: #77812B; font-weight: bold;'>TALII SPÓŁKI</span> <img src='/src/assets/images/interface/apple.png' alt='jabłko' class='card-icon' />.",
    ],
    ability:
      "Dobierz 3<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 5,
    effects: [
      "Sprzedaj ze swojej puli <span style='color: #FFFFFF; font-weight: bold;'>OWOC</span> kosztujący 3<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub więcej.",
      "Usuń wszystkie odkryte karty <span style='color: #77812B; font-weight: bold;'>TALII WPŁYWU</span>. Następnie uzupełnij <span style='color: #77812B; font-weight: bold;'>TALIĘ WPŁYWU</span>.",
    ],
    ability:
      "Dobierz 6<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 6,
    effects: [
      "Kup najtańszy <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>.",
      "Kup najtańszy <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>.",
    ],
    ability:
      "Jeśli kupiłeś przynajmniej 1 <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>, dobierz 2<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 7,
    effects: [
      "Kup <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span> w <span style='color: #E76C33; font-weight: bold;'>SPÓŁCE</span> <img src='/src/assets/images/interface/pineapple.png' alt='ananas' class='card-icon' />, jeśli jego cena wynosi 8<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub mniej.",
      "Kup <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span> w <span style='color: #E76C33; font-weight: bold;'>SPÓŁCE</span> <img src='/src/assets/images/interface/pineapple.png' alt='ananas' class='card-icon' />, jeśli jego cena wynosi 8<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub mniej.",
    ],
    ability:
      "Jeśli kupiłeś przynajmniej 1 <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>, dobierz 2<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 8,
    effects: [
      "Kup <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span> w <span style='color: #E76C33; font-weight: bold;'>SPÓŁCE</span> <img src='/src/assets/images/interface/lemon.png' alt='cytryna' class='card-icon' />, jeśli jego cena wynosi 8<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub mniej.",
      "Kup <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span> w <span style='color: #E76C33; font-weight: bold;'>SPÓŁCE</span> <img src='/src/assets/images/interface/lemon.png' alt='cytryna' class='card-icon' />, jeśli jego cena wynosi 8<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub mniej.",
    ],
    ability:
      "Jeśli kupiłeś przynajmniej 1 <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>, dobierz 2<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 9,
    effects: [
      "Kup <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span> w <span style='color: #E76C33; font-weight: bold;'>SPÓŁCE</span> <img src='/src/assets/images/interface/apple.png' alt='jabłko' class='card-icon' />, jeśli jego cena wynosi 8<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub mniej.",
      "Kup <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span> w <span style='color: #E76C33; font-weight: bold;'>SPÓŁCE</span> <img src='/src/assets/images/interface/apple.png' alt='jabłko' class='card-icon' />, jeśli jego cena wynosi 8<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' /> lub mniej.",
    ],
    ability:
      "Jeśli kupiłeś przynajmniej 1 <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>, dobierz 2<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 10,
    effects: [
      "Jeśli nie jesteś pierwszym graczem, dobierz wierzchnią kartę z TALII WPŁYWU. Pokaż ją wszystkim graczom, a następnie wtasuj do TALII Spółki <img src='/src/assets/images/interface/apple.png' alt='jabłko' class='card-icon' />.",
    ],
    ability:
      "Jeśli to zrobiłeś, dobierz 5<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 11,
    effects: [
      "Jeśli nie jesteś pierwszym graczem, dobierz wierzchnią kartę z TALII WPŁYWU. Pokaż ją wszystkim graczom, a następnie wtasuj do TALII Spółki <img src='/src/assets/images/interface/lemon.png' alt='cytryna' class='card-icon' />.",
    ],
    ability:
      "Jeśli to zrobiłeś, dobierz 5<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 12,
    effects: [
      "Jeśli nie jesteś pierwszym graczem, dobierz wierzchnią kartę z TALII WPŁYWU. Pokaż ją wszystkim graczom, a następnie wtasuj do TALII Spółki <img src='/src/assets/images/interface/pineapple.png' alt='ananas' class='card-icon' />.",
    ],
    ability:
      "Jeśli to zrobiłeś, dobierz 5<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
  {
    id: 13,
    effects: [
      "Sprzedaj swój najdroższy <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>.",
      "Sprzedaj swój najdroższy <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>.",
    ],
    ability:
      "Jeśli sprzedałeś przynajmniej 1 <span style='color: #E76C33; font-weight: bold;'>UDZIAŁ</span>, dobierz 6<img src='/src/assets/images/interface/money.png' alt='moneta' class='card-icon' />.",
  },
];

export const TOTAL_CARDS = BOT_CARDS.length;
