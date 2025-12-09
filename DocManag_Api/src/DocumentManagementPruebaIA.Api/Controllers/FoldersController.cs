using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.UseCases.Folders;
using DocumentManagementPruebaIA.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace DocumentManagementPruebaIA.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class FoldersController : ControllerBase
{
    private readonly CreateFolderHandler _createFolderHandler;
    private readonly UpdateFolderHandler _updateFolderHandler;
    private readonly DeleteFolderHandler _deleteFolderHandler;

    public FoldersController(
        CreateFolderHandler createFolderHandler,
        UpdateFolderHandler updateFolderHandler,
        DeleteFolderHandler deleteFolderHandler)
    {
        _createFolderHandler = createFolderHandler;
        _updateFolderHandler = updateFolderHandler;
        _deleteFolderHandler = deleteFolderHandler;
    }

    [HttpPost]
    [ProducesResponseType(typeof(FolderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateFolderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _createFolderHandler.HandleAsync(command, cancellationToken);
            return CreatedAtAction(nameof(GetPlaceholder), new { id = result.Id }, result);
        }
        catch (DomainRuleViolationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // Placeholder endpoint to satisfy CreatedAtAction without exposing a read handler yet
    [ApiExplorerSettings(IgnoreApi = true)]
    [HttpGet("{id:guid}")]
    public IActionResult GetPlaceholder(Guid id) => NotFound();

    [HttpPut("{folderId:guid}")]
    [ProducesResponseType(typeof(FolderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAsync(Guid folderId, [FromBody] UpdateFolderCommand command, CancellationToken cancellationToken)
    {
        if (command.FolderId != folderId)
        {
            return BadRequest(new { error = "El identificador de la ruta no coincide con el cuerpo." });
        }

        try
        {
            var result = await _updateFolderHandler.HandleAsync(command, cancellationToken);
            return Ok(result);
        }
        catch (DomainRuleViolationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{folderId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteAsync(Guid folderId, CancellationToken cancellationToken)
    {
        try
        {
            await _deleteFolderHandler.HandleAsync(new DeleteFolderCommand(folderId), cancellationToken);
            return NoContent();
        }
        catch (DomainRuleViolationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
