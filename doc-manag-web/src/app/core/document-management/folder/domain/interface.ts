export namespace IFolderManagement {
  export interface CreateFolderRequest {
    roleIdFolder: string;
    name: string;
    description?: string;
    color?: string;
    parentFolderId?: string;
  }

  export interface UpdateFolderRequest {
    id: string;
    name?: string;
    description?: string;
    color?: string;
    roleIdFolder?: string;
  }

  export interface ParentFolderCardResponse {
    id: string;
    name: string;
    color?: string;
    totalDocuments?: number;
    totalSizeBytes?: number;
    lastUpdatedAt?: string;
  }

  export interface FolderResponse {
    id: string;
    propertyId: string;
    order: number;
    name: string;
    description?: string;
    color?: string;
    parentFolderId?: string;
    path: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    filesCount?: number;
    roleId?: string;
  }

  export interface FolderUpdateResponse {
    id: string;
    name: string;
    description?: string;
    color?: string;
    parentFolderId?: string;
    path: string;
    permissions: RolePermissionResponse[];
  }

  export interface RolePermissionResponse {
    roleId: string;
    permissions: string[];
  }

  export interface FolderSummaryResponse {
    id: string;
    name: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
    totalFiles: number;
    totalSizeBytes: number;
    totalFolders: number;
    children: ChildrenFolderNodeResponse;
  }

  export interface ChildrenFolderNodeResponse {
    id: string;
    name: string;
    color?: string;
    filesCount?: number;
    sizeBytes?: number;
  }

  export interface BreadcrumbItem {
    name: string;
    id: string;
    slug: string;
  }

  export interface SelectedRole {
    CREATE_FOLDER_MANAGEMENT: boolean;
    UPDATE_FOLDER_MANAGEMENT: boolean;
    DELETE_FOLDER_MANAGEMENT: boolean;
    name: string;
    id: string;
  }
}
