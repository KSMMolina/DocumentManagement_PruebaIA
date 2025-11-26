using DocumentManagementPruebaIA.Domain.Entities;

namespace DocumentManagementPruebaIA.Application.Contracts.DTOs;

public sealed record PermissionDto(UserRole Role, bool CanView, bool CanDownload);
