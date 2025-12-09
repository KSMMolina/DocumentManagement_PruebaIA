export namespace IDocumentManagement {
  
  export interface UploadFileRequest {
    folderId: string;
    name: string;
    files: File[];
    description?: string;
  }

  export interface UpdateFileRequest {
    id: string;
    name?: string;
    description?: string;
  }

  export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    file: File;
    progress: number;
  }

  export interface MenuOverlayOption {
    icon: string;
    label: string;
    isDanger?: boolean;
    action: () => void;
    loading?: any;
  }

  export interface FileResponse {
    id: string;
    folderId: string;
    name: string;
    folderName?: string;
    size: number;
    type: string;
    url: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  }

  export interface PropertyFilesSummaryRepsonse {
    totalFiles: number;
    totalSizeBytes: number;
    folders: FolderFileNodeResponse[];
  }

  export interface FolderFileNodeResponse {
    id: string;
    name: string;
    color?: string;
    parentFolderId?: string;
    description?: string;
    path: string;
    files: FileItemResponse[];
    children: FolderFileNodeResponse[];
  }

  export interface FileItemResponse {
    id: string;
    folderId: string;
    name: string;
    size: number;
    type: string;
    url: string;
    description?: string;
    createdAt: string;
  }

  
}