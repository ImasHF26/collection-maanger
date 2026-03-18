import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { CollectionItem } from '../../models/collection-item';

@Component({
  standalone: true,
  selector: 'app-collection-item-card',
  imports: [],
  templateUrl: './collection-item-card.html',
  styleUrl: './collection-item-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionItemCard {
  item = input.required<CollectionItem>();
}
