using DocManagApi_pruebaIa.Application.Folders.Commands.CreateSubfolder;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocumentManagementApi_pruebaIa.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DocumentManagementApi_pruebaIa.Controllers;

[ApiController]
[Route("api/folders")]
public class FoldersController : ControllerBase
{
    private readonly IMediator _mediator;

    public FoldersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("{parentFolderId}/subfolders")]
    public async Task<ActionResult<Guid>> CreateSubfolder(Guid parentFolderId, [FromBody] CreateSubfolderDto dto, CancellationToken ct)
    {
        var cmd = new CreateSubfolderCommand(parentFolderId, dto.Name, dto.Description);
        var result = await _mediator.Send(cmd, ct);

        return ResultToActionResult.ToActionResult(this, result);
    }

    public sealed record CreateSubfolderDto(string Name, string? Description);
}