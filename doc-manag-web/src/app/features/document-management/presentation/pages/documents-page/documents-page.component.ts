import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentManagementFacade } from '../../../application/facades/document-management.facade';


@Component({
  selector: 'app-documents-page',
  imports: [RouterLink],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DocumentsPageComponent implements OnInit {
  private readonly facade = inject(DocumentManagementFacade);

  documents = this.facade.documents;
  loading = this.facade.loadingDocuments;
  error = this.facade.error;

  ngOnInit(): void {
    // TODO: en el futuro, obtener folderId desde ruta o breadcrumb
    const demoFolderId = 'root-1';
    this.facade.loadDocumentsByFolder(demoFolderId);
  }
}
