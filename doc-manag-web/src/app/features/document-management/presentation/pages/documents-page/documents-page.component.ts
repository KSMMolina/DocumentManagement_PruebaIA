import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DocumentManagementFacade } from '../../../application/facades/document-management.facade';

@Component({
  selector: 'app-documents-page',
  imports: [CommonModule],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsPageComponent implements OnInit {
  private readonly facade = inject(DocumentManagementFacade);
  private readonly location = inject(Location);

  documents = this.facade.documents;
  loading = this.facade.loadingDocuments;
  error = this.facade.error;

  // view mode: 'list' for large cards, 'grid' for compact cards
  viewMode: 'list' | 'grid' = 'list';

  ngOnInit(): void {
    const demoFolderId = 'root-1';
    this.facade.loadDocumentsByFolder(demoFolderId);
  }

  getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'image/jpeg': 'JPG',
      'image/png': 'PNG'
    };
    return extensions[mimeType] || 'FILE';
  }

  formatSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES');
  }

  setListView(): void {
    this.viewMode = 'list';
  }

  setGridView(): void {
    this.viewMode = 'grid';
  }

  onBack(): void {
    this.location.back();
  }

}
