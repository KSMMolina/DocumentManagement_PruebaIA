import { Folder } from '../../domain/models/folder.model';
import { FolderDto } from '../http/document-management-api';

export function mapFolderDtoToDomain(dto: FolderDto): Folder {
  return {
    id: dto.id,
    propertyId: dto.propertyId,
    order: dto.order,
    name: dto.name,
    description: dto.description,
    color: dto.color,
    parentFolderId: dto.parentFolderId ?? null,
    path: dto.path,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    createdBy: dto.createdBy,
    updatedBy: dto.updatedBy,
    filesCount: dto.filesCount,
    roleId: dto.roleId,
  };
}
