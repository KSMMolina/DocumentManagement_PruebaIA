namespace DocManagApi_pruebaIa.Domain.Common.Results;

public static class DomainErrorCodes
{
    public const string FolderMaxDepthExceeded = "Folder.MaxDepthExceeded";
    public const string FolderMaxSubfoldersExceeded = "Folder.MaxSubfoldersExceeded";
    public const string FolderDuplicateName = "Folder.DuplicateName";
    public const string FolderMaxDocumentsExceeded = "Folder.MaxDocumentsExceeded";
    public const string DocumentNameDuplicate = "Document.DuplicateName";
    public const string DocumentFileSizeTooLarge = "Document.FileSizeTooLarge";
    public const string PermissionsCannotRevokeAdmin = "Permissions.CannotRevokeAdmin";
}