export const Rarities = {
  Legendary: 'Legendary',
  Rare: 'Rare',
  Common: 'Common',
  Uncommon: 'Uncommon',
} as const;
export type Rarity = typeof Rarities[keyof typeof Rarities];


export class CollectionItem {
  
  id=-1;
  name = "linx";
  description = " is a legendary sword of immense power, often associated with King Arthur. It is said to possess magical properties and is a symbol of divine kingship and heroism in Arthurian legend.";
  price = 199;
  rarity: Rarity = Rarities.Legendary;
  image = 'img/linx.png';

  copy(){
    return Object.assign(new CollectionItem(), this);
  }
}