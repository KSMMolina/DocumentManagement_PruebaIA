using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.UseCases.Documents;
using DocumentManagementPruebaIA.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace DocumentManagementPruebaIA.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DocumentsController : ControllerBase
{
    private readonly StoreDocumentHandler _storeDocumentHandler;
    private readonly UpdateDocumentHandler _updateDocumentHandler;
    private readonly SearchDocumentsHandler _searchDocumentsHandler;

    public DocumentsController(
        StoreDocumentHandler storeDocumentHandler,
        UpdateDocumentHandler updateDocumentHandler,
        SearchDocumentsHandler searchDocumentsHandler)
    {
        _storeDocumentHandler = storeDocumentHandler;
        _updateDocumentHandler = updateDocumentHandler;
        _searchDocumentsHandler = searchDocumentsHandler;
    }

    [HttpPost]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StoreAsync([FromBody] StoreDocumentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _storeDocumentHandler.HandleAsync(command, cancellationToken);
            return CreatedAtAction(nameof(GetPlaceholder), new { id = result.Id }, result);
        }
        catch (DomainRuleViolationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // Placeholder to satisfy CreatedAtAction
    [ApiExplorerSettings(IgnoreApi = true)]
    [HttpGet("{id:guid}")]
    public IActionResult GetPlaceholder(Guid id) => NotFound();

    [HttpPut("{documentId:guid}")]
    [ProducesResponseType(typeof(DocumentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAsync(Guid documentId, [FromBody] UpdateDocumentCommand command, CancellationToken cancellationToken)
    {
        if (command.DocumentId != documentId)
        {
            return BadRequest(new { error = "El identificador de la ruta no coincide con el cuerpo." });
        }

        try
        {
            var result = await _updateDocumentHandler.HandleAsync(command, cancellationToken);
            return Ok(result);
        }
        catch (DomainRuleViolationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<DocumentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchAsync([FromQuery] Guid propertyId, [FromQuery] string? folderName, [FromQuery] string? fileName, CancellationToken cancellationToken)
    {
        var query = new SearchDocumentsQuery(propertyId, folderName, fileName);
        var result = await _searchDocumentsHandler.HandleAsync(query, cancellationToken);
        return Ok(result);
    }
}
