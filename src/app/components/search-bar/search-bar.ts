import { ChangeDetectionStrategy, Component, input, model, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {

  search = model("Initial");

  searchButtonClicked: OutputEmitterRef<void> = output<void>({
    alias: "submit"
  });

  searchClicked() {
    this.searchButtonClicked.emit();
  }



}
