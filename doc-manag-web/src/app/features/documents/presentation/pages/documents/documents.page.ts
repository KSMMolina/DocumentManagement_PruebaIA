import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";

import { GetDocumentsUseCase } from "@features/documents/application/use-cases/get-documents.use-case";

@Component({
  selector: "app-documents-page",
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor],
  template: `
    <section class="documents">
      <header class="documents__header">
        <h1>Documentos</h1>
        <p>Listado obtenido desde el caso de uso y repositorio en memoria.</p>
      </header>

      <ul class="documents__list" *ngIf="documents$ | async as documents">
        <li *ngFor="let doc of documents" class="documents__item">
          <div class="documents__title">{{ doc.title }}</div>
          <div class="documents__meta">
            <span class="pill">Estado: {{ doc.status }}</span>
            <span class="pill">Actualizado: {{ doc.updatedAt | date: 'short' }}</span>
          </div>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .documents {
        display: grid;
        gap: 0.75rem;
        padding: 1rem;
      }

      .documents__header h1 {
        margin: 0 0 0.25rem 0;
        font-size: 1.4rem;
      }

      .documents__header p {
        margin: 0;
        color: #4a5568;
      }

      .documents__list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.5rem;
      }

      .documents__item {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 0.85rem;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      .documents__title {
        font-weight: 600;
        margin-bottom: 0.35rem;
      }

      .documents__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        color: #4a5568;
        font-size: 0.9rem;
      }

      .pill {
        border-radius: 999px;
        padding: 0.15rem 0.65rem;
        background: #edf2f7;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentsPageComponent {
  private readonly getDocuments = inject(GetDocumentsUseCase);
  readonly documents$ = this.getDocuments.execute();
}
