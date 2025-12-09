export interface DocumentModel {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  updatedAt: string;
}

export type DocumentDraft = Omit<DocumentModel, "id" | "updatedAt">;
