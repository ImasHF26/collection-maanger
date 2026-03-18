import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { CollectionItem, Rarities } from '../models/collection-item';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {

  private collections: Collection[] = [];
  private currentId = 1;
  // private currentItemIndex: Record<number, number> = {};
   private currentItemIndex: {[key: number]: number}= {};

  // constructor() {
  //   this.generateDummyData();
  // }

      constructor() {
       this.load();
   }

   private save() { 
    localStorage.setItem('collections', JSON.stringify(this.collections));
   }

    private load() {
    const collectionJson = localStorage.getItem('collections');
    if (collectionJson) {
      this.collections = JSON.parse(collectionJson).map((collectionJson: any) => {
        const collection = Object.assign(new Collection(), collectionJson);
        const itemsJson = collectionJson['items'] || [];
        collection.items = itemsJson.map((item: any) => Object.assign(new CollectionItem(), item));
        return collection;
      });

      this.currentId = Math.max(...this.collections.map(collection => collection.id), 0) + 1;
      this.currentItemIndex = this.collections.reduce(
        (indexes: { [key: number]: number }, collection) => {
          const maxItemId = Math.max(...collection.items.map(item => item.id), 0);
          indexes[collection.id] = maxItemId + 1;
          return indexes;
        }, {});
    } else {
      this.generateDummyData();
      this.save();
    }
  }
  generateDummyData() {
    const coin = new CollectionItem();
    coin.name = "Pièce de monnaie en or";  
    coin.description = "Pièce de 50 centimes de francs";
    coin.price = 170;
    coin.rarity = Rarities.Common;
    coin.image = 'img/coin1.png';

    const stamp = new CollectionItem();
    stamp.name = "Timbre rare";
    stamp.description = "Un timbre rare du 19ème siècle, très recherché par les collectionneurs.";
    stamp.price = 500;
    stamp.rarity = Rarities.Rare;
    stamp.image = 'img/timbre1.png';

    const linx = new CollectionItem();
    
    const defaultCollection = new Collection();
    defaultCollection.title = "Collection mix";
    
    const storedCollection = this.add(defaultCollection);
    this.addItem(storedCollection, coin);
    this.addItem(storedCollection, linx);
    this.addItem(storedCollection, stamp); 
    
}
    
  getAll(): Collection[] {
      return this.collections.map(collection => collection.copy());
 }

  get(collectionId:number): Collection | null {
    const storedCopy = this.collections.find(
      collection => collection.id === collectionId);

      if(!storedCopy) return null;
      return storedCopy.copy();
  }

  add(collection: Omit<Collection, 'id' | 'items'>): Collection {
    const storedCopy = Object.assign(new Collection(), collection);
    storedCopy.id = this.currentId++;
    storedCopy.items = [];
    this.collections.push(storedCopy);

    this.currentItemIndex[storedCopy.id] = 1;
    this.save();

    return storedCopy.copy();
  }
  
  update(collection: Omit<Collection, 'items'>): Collection | null {
    const storedCopy = this.collections.find(
      c => c.id === collection.id);
    if (!storedCopy) return null;
    Object.assign(storedCopy, collection);
    this.save();
    return storedCopy.copy();
  }

  delete(collectionId: number): void {
    this.collections = this.collections.filter(
      collection => collection.id !== collectionId);
  }

  addItem(collection: Collection, item: CollectionItem): CollectionItem | null {
    const storedCollection = this.collections.find(
      c => c.id === collection.id);
    if (!storedCollection) return null;

    const storedItem = item.copy();
    storedItem.id = this.currentItemIndex[storedCollection.id]++;
    storedCollection.items.push(storedItem);
    this.save();
    return storedItem.copy();
  }

  updateItem(collection: Collection, item: CollectionItem): CollectionItem | null {
    const storedCollection = this.collections.find(
      storedCollection => storedCollection.id === collection.id
    );

    if (!storedCollection) return null;

    const storedItemIndex = storedCollection.items.findIndex(
      storedItem => storedItem.id === item.id);

    if (storedItemIndex === -1) return null;

    storedCollection.items[storedItemIndex] = item.copy();
    this.save();
    return storedCollection.items[storedItemIndex].copy();
  }

  deleteItem(collection: Collection, itemId: number): Collection | null {
    const storedCollection = this.collections.find(
      storedCollection => storedCollection.id === collection.id
    );

    if (!storedCollection) return null;

    storedCollection.items = storedCollection.items.filter(
      item => item.id !== itemId);
      this.save();
    return storedCollection.copy();
  }
}




