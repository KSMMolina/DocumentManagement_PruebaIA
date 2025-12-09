import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentManagementFacade } from '../../../application/facades/document-management.facade';


@Component({
  selector: 'app-folders-page',
  imports: [RouterLink],
  templateUrl: './folders-page.component.html',
  styleUrl: './folders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FoldersPageComponent implements OnInit {
  private readonly facade = inject(DocumentManagementFacade);

  // signals expuestos al template
  folders = this.facade.folders;
  loading = this.facade.loadingFolders;
  error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadRootFolders();
  }
}
