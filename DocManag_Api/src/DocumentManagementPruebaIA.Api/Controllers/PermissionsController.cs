using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.UseCases.Permissions;
using DocumentManagementPruebaIA.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace DocumentManagementPruebaIA.Api.Controllers;

[ApiController]
[Route("api/folders/{folderId:guid}/permissions")]
public sealed class PermissionsController : ControllerBase
{
    private readonly AssignPermissionsHandler _assignPermissionsHandler;

    public PermissionsController(AssignPermissionsHandler assignPermissionsHandler)
    {
        _assignPermissionsHandler = assignPermissionsHandler;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignAsync(Guid folderId, [FromBody] AssignPermissionsCommand command, CancellationToken cancellationToken)
    {
        if (command.FolderId != folderId)
        {
            return BadRequest(new { error = "El identificador de la ruta no coincide con el cuerpo." });
        }

        try
        {
            await _assignPermissionsHandler.HandleAsync(command, cancellationToken);
            return NoContent();
        }
        catch (DomainRuleViolationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
