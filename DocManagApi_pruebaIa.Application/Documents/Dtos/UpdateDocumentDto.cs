using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocManagApi_pruebaIa.Application.Documents.Dtos
{
    public sealed record UpdateDocumentDto(Guid Id, string? Name, string? Description);
}
