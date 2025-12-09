import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panel-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './panel-page.component.html',
  styleUrl: './panel-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelPageComponent {

}
