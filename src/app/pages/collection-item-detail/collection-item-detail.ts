import { CollectionItem } from './../../models/collection-item';
import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Rarities } from '../../models/collection-item';
import { CollectionItemCard } from '../../components/collection-item-card/collection-item-card';
import { CollectionService } from '../../services/collection-service';
import { Collection } from '../../models/collection';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-collection-item-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CollectionItemCard],
  templateUrl: './collection-item-detail.html',
  styleUrl: './collection-item-detail.scss',
})
export class CollectionItemDetail implements OnDestroy {

    private fb= inject(FormBuilder);
    private router = inject(Router);
    private collectionService = inject(CollectionService);
      
    readonly rarities = Object.values(Rarities);


    
    itemId = input<number | null, string | null>(null, {
      alias: "id",
      transform: ((id: string | null)=> id ? parseInt(id) : null)
      
    });

    selectedCollection!: Collection;
    CollectionItem = signal<CollectionItem>(new CollectionItem());
    valueChangeSubscription :Subscription | null = null;

  itemFormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    image: ['', [Validators.required]],
    rarity: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(){
    effect(() => {
      let itemToDisplay = new CollectionItem();
      this.selectedCollection = this.collectionService.getAll()[0];
      if(this.itemId()){
        const itemFound = this.selectedCollection.items.find(item => item.id === this.itemId());
        if(itemFound){
          itemToDisplay = itemFound;
        } else {
          this.router.navigate(['not-found']);
        }
      }
      this.itemFormGroup.patchValue(itemToDisplay);
    });
    this.valueChangeSubscription = this.itemFormGroup.valueChanges.subscribe(
      (_) => {
        this.CollectionItem.set(
          Object.assign(new CollectionItem(), this.itemFormGroup.value)); 

      }
    );
  }

  submit(event: Event) {
    event.preventDefault();
    console.log(this.itemFormGroup.value);

  }
isFieldValid(fieldName: string) {
  const formControl = this.itemFormGroup.get(fieldName);
  return formControl?.invalid && (formControl?.dirty || formControl?.touched);
}

onFileChange(event: any) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.itemFormGroup.patchValue({
        image: reader.result as string
      });
    };
  }
}
  
  // private readonly activatedRoute = inject(ActivatedRoute);
  // private readonly router = inject(Router);

    // itemId = signal<number | null>(null);
    // itemId = input<number | null, string | null>(null, {
    //   alias: "id",
    //   transform: value => value ? parseInt(value) : null
      
    // });
  // routeSubscription :Subscription | null = null;
  
  // ngOnInit(): void {
  
  //   this.routeSubscription = this.activatedRoute.params.subscribe(
  //     params => {
  //       const selectedId = params['id'] ? parseInt(params['id']) : null;
  //       this.itemId.set(selectedId);
  //     }
  //   );
  // }

//   next() {
//     const currentId = this.itemId();
//     if (currentId) {
//       const nextId = currentId + 1;
//       this.router.navigate(['item', nextId]); // --> /home/2
//   }
// }

// ngOnDestroy(): void {
//   if(this.routeSubscription){
//     this.routeSubscription.unsubscribe();
//   }

ngOnDestroy(): void {
  if(this.valueChangeSubscription){
    this.valueChangeSubscription.unsubscribe();
  }

}
}
