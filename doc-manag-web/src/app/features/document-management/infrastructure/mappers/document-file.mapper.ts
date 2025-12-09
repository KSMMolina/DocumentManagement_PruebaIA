import { DocumentFile } from '../../domain/models/document-file.model';
import { DocumentFileDto } from '../http/document-management-api';

export function mapDocumentFileDtoToDomain(
  dto: DocumentFileDto
): DocumentFile {
  return {
    id: dto.id,
    folderId: dto.folderId,
    folderName: dto.folderName,
    name: dto.name,
    sizeBytes: dto.sizeBytes,
    mimeType: dto.mimeType,
    url: dto.url,
    description: dto.description,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    createdBy: dto.createdBy,
    updatedBy: dto.updatedBy,
  };
}
