import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { CollectionService } from '../../services/collection-service';
import { CollectionItemCard } from '../../components/collection-item-card/collection-item-card';
import { SearchBar } from '../../components/search-bar/search-bar';
import { Collection } from '../../models/collection';
import { CollectionItem } from '../../models/collection-item';

@Component({
  standalone: true,
  selector: 'app-collection-detail',
  imports: [CollectionItemCard, SearchBar],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionDetail {




  private collectionService = inject(CollectionService);


  searchText = model('');
  // count = 0;

  coin!: CollectionItem;
  linx!: CollectionItem;
  stamp!: CollectionItem;

  selectedCollection = signal<Collection | null>(null);
  collectionItems = computed(() => {
    const AllItems= this.selectedCollection()?.items;
    return AllItems?.filter(
      item => item.name.toLocaleLowerCase().includes(
        this.searchText().toLocaleLowerCase())
      ) || [];
  });
  // selectedItemIndex = signal(0);
  // selectedItem = computed(() => {
  //   return this.itemList[this.selectedItemIndex()];
  // });

  // logEffect = effect(() => {
  //   console.log(this.selectedItem(), this.selectedItem());
  // });


  constructor() {
    const allCollections = this.collectionService.getAll();
    if(allCollections.length > 0){
    this.selectedCollection.set(allCollections[0]);
   }
  
  }

  addGenericItem() {
    const collection = this.selectedCollection();
    if (!collection) return;

    const storedItem = this.collectionService.addItem(collection, new CollectionItem());
    // storedItem may still be null if the collection wasn't found in the service
    if (storedItem) {
      // Refresh the selected collection signal so the UI sees the new item
      const updated = this.collectionService.get(collection.id);
      if (updated) {
        this.selectedCollection.set(updated);
      }
    }
  }
}

