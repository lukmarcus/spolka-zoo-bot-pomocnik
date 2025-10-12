// Bot Cards Data - Spółka ZOO Bot Helper
// Real card content from Spółka ZOO board game

import type { BotCard } from "./types";

export const ICONS = {
  money: "/src/assets/images/interface/money.png",
  card: "/src/assets/images/interface/card.png",
  apple: "/src/assets/images/interface/apple.png",
  lemon: "/src/assets/images/interface/lemon.png",
  pineapple: "/src/assets/images/interface/pineapple.png",
};

// Real Spółka ZOO cards (13 cards total)
export const BOT_CARDS: BotCard[] = [
  {
    id: 1,
    effects: [
      `Kup najtańszy <span class='text-white'>Owoc</span> z <span class='text-white'>Magazynu</span>. Jeśli danego <span class='text-white'>Owocu</span> nie ma w <span class='text-white'>Magazynie</span>, odkup go od innego gracza (pierwszego z lewej, który ma ten <span class='text-white'>Owoc</span> w swojej puli).`,
      `Kup najtańszy <span class='text-white'>Owoc</span> z <span class='text-white'>Magazynu</span>. Jeśli danego <span class='text-white'>Owocu</span> nie ma w <span class='text-white'>Magazynie</span>, odkup go od innego gracza (pierwszego z lewej, który ma ten <span class='text-white'>Owoc</span> w swojej puli).`,
    ],
    ability: `Jeśli kupiłeś przynajmniej 1 <span class='text-white'>Owoc</span>, dobierz 3<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 2,
    effects: [
      "Zatrudnij <span class='text-red'>Pomocnika</span>.",
      `Przełóż jawnie wierzchnią <img src="${ICONS.card}" class="card-icon" /> z <span class='text-green'>Talii Spółki</span> <img src="${ICONS.lemon}" class="card-icon" /> na wierzch <span class='text-green'>Talii Spółki</span> <img src="${ICONS.pineapple}" class="card-icon" />.`,
    ],
    ability: `Dobierz 3<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 3,
    effects: [
      "Zatrudnij <span class='text-red'>Pomocnika</span>.",
      `Przełóż jawnie wierzchnią <img src="${ICONS.card}" class="card-icon" /> z <span class='text-green'>Talii Spółki</span> <img src="${ICONS.apple}" class="card-icon" /> na wierzch <span class='text-green'>Talii Spółki</span> <img src="${ICONS.lemon}" class="card-icon" />.`,
    ],
    ability: `Dobierz 3<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 4,
    effects: [
      "Zatrudnij <span class='text-red'>Pomocnika</span>.",
      `Przełóż jawnie wierzchnią <img src="${ICONS.card}" class="card-icon" /> z <span class='text-green'>Talii Spółki</span> <img src="${ICONS.pineapple}" class="card-icon" /> na wierzch <span class='text-green'>Talii Spółki</span> <img src="${ICONS.apple}" class="card-icon" />.`,
    ],
    ability: `Dobierz 3<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 5,
    effects: [
      `Sprzedaj ze swojej puli <span class='text-white'>Owoc</span> kosztujący 3<img src="${ICONS.money}" class="card-icon" /> lub więcej.`,
      "Usuń wszystkie odkryte karty <span class='text-green'>Talii Wpływu</span>. Następnie uzupełnij <span class='text-green'>Talię Wpływu</span>.",
    ],
    ability: `Dobierz 6<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 6,
    effects: [
      "Kup najtańszy <span class='text-orange'>Udział</span>.",
      "Kup najtańszy <span class='text-orange'>Udział</span>.",
    ],
    ability: `Jeśli kupiłeś przynajmniej 1 <span class='text-orange'>Udział</span>, dobierz 2<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 7,
    effects: [
      `Kup <span class='text-orange'>Udział</span> w <span class='text-orange'>Spółce</span> <img src="${ICONS.pineapple}" class="card-icon" />, jeśli jego cena wynosi 8<img src="${ICONS.money}" class="card-icon" /> lub mniej.`,
      `Kup <span class='text-orange'>Udział</span> w <span class='text-orange'>Spółce</span> <img src="${ICONS.pineapple}" class="card-icon" />, jeśli jego cena wynosi 8<img src="${ICONS.money}" class="card-icon" /> lub mniej.`,
    ],
    ability: `Jeśli kupiłeś przynajmniej 1 <span class='text-orange'>Udział</span>, dobierz 2<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 8,
    effects: [
      `Kup <span class='text-orange'>Udział</span> w <span class='text-orange'>Spółce</span> <img src="${ICONS.lemon}" class="card-icon" />, jeśli jego cena wynosi 8<img src="${ICONS.money}" class="card-icon" /> lub mniej.`,
      `Kup <span class='text-orange'>Udział</span> w <span class='text-orange'>Spółce</span> <img src="${ICONS.lemon}" class="card-icon" />, jeśli jego cena wynosi 8<img src="${ICONS.money}" class="card-icon" /> lub mniej.`,
    ],
    ability: `Jeśli kupiłeś przynajmniej 1 <span class='text-orange'>Udział</span>, dobierz 2<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 9,
    effects: [
      `Kup <span class='text-orange'>Udział</span> w <span class='text-orange'>Spółce</span> <img src="${ICONS.apple}" class="card-icon" />, jeśli jego cena wynosi 8<img src="${ICONS.money}" class="card-icon" /> lub mniej.`,
      `Kup <span class='text-orange'>Udział</span> w <span class='text-orange'>Spółce</span> <img src="${ICONS.apple}" class="card-icon" />, jeśli jego cena wynosi 8<img src="${ICONS.money}" class="card-icon" /> lub mniej.`,
    ],
    ability: `Jeśli kupiłeś przynajmniej 1 <span class='text-orange'>Udział</span>, dobierz 2<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 10,
    effects: [
      `Jeśli nie jesteś pierwszym graczem, dobierz wierzchnią kartę z <span class='text-green'>Talii Wpływu</span>. Pokaż ją wszystkim graczom, a następnie wtasuj do <span class='text-green'>Talii Spółki</span> <img src="${ICONS.apple}" class="card-icon" />.`,
    ],
    ability: `Jeśli to zrobiłeś, dobierz 5<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 11,
    effects: [
      `Jeśli nie jesteś pierwszym graczem, dobierz wierzchnią kartę z <span class='text-green'>Talii Wpływu</span>. Pokaż ją wszystkim graczom, a następnie wtasuj do <span class='text-green'>Talii Spółki</span> <img src="${ICONS.lemon}" class="card-icon" />.`,
    ],
    ability: `Jeśli to zrobiłeś, dobierz 5<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 12,
    effects: [
      `Jeśli nie jesteś pierwszym graczem, dobierz wierzchnią kartę z <span class='text-green'>Talii Wpływu</span>. Pokaż ją wszystkim graczom, a następnie wtasuj do <span class='text-green'>Talii Spółki</span> <img src="${ICONS.pineapple}" class="card-icon" />.`,
    ],
    ability: `Jeśli to zrobiłeś, dobierz 5<img src="${ICONS.money}" class="card-icon" />.`,
  },
  {
    id: 13,
    effects: [
      "Sprzedaj swój najdroższy <span class='text-orange'>Udział</span>.",
      "Sprzedaj swój najdroższy <span class='text-orange'>Udział</span>.",
    ],
    ability: `Jeśli sprzedałeś przynajmniej 1 <span class='text-orange'>Udział</span>, dobierz 6<img src="${ICONS.money}" class="card-icon" />.`,
  },
];

export const TOTAL_CARDS = BOT_CARDS.length;
