using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Application.Documents.Commands.UploadDocument;
using DocManagApi_pruebaIa.Application.Documents.Dtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DocManagApi_pruebaIa.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DocumentController : ControllerBase
{
    private readonly ISender _sender;

    public DocumentController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Sube un documento a una carpeta.
    /// </summary>
    /// <param name="folderId">Id de la carpeta destino.</param>
    /// <param name="file">Archivo a subir.</param>
    /// <param name="name">Nombre lógico (opcional, por defecto nombre del archivo).</param>
    /// <param name="description">Descripción opcional.</param>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(
        [FromForm] Guid folderId,
        [FromForm] IFormFile file,
        [FromForm] string? name,
        [FromForm] string? description,
        CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new ProblemDetails
            {
                Title = "Archivo inválido",
                Detail = "El archivo está vacío.",
                Status = StatusCodes.Status400BadRequest
            });
        var command = new UploadDocumentCommand(
            FolderId: folderId,
            Name: name ?? file.FileName,
            Description: description ?? string.Empty,
            SizeBytes: file.Length
        );

        var result = await _sender.Send(command, ct);
        return ToActionResult(result, id => CreatedAtAction(nameof(GetById), new { id }, new { Id = id }));
    }

    /// <summary>
    /// Obtiene un documento por Id (metadatos).
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var query = new GetDocumentByIdQuery(id);
        var result = await _sender.Send(query, ct);
        return ToActionResult(result);
    }

    /// <summary>
    /// Descarga el contenido de un documento por Id.
    /// </summary>
    [HttpGet("download/{id:guid}")]
    public async Task<IActionResult> Download(Guid id, CancellationToken ct)
    {
        var query = new DownloadDocumentQuery(id);
        var result = await _sender.Send(query, ct);
        return ToActionResult(result, doc =>
        {
            // doc debería contener: Content (byte[]), ContentType, FileName
            return File(doc.Content, doc.ContentType ?? "application/octet-stream", doc.FileName);
        });
    }

    /// <summary>
    /// Actualiza metadatos (nombre, descripción) de un documento.
    /// </summary>
    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] UpdateDocumentDto dto, CancellationToken ct)
    {
        var command = new UpdateDocumentCommand(dto.Id, dto.Name, dto.Description);
        var result = await _sender.Send(command, ct);
        return ToActionResult(result);
    }

    /// <summary>
    /// Elimina (lógico) un documento por Id.
    /// </summary>
    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var command = new DeleteDocumentCommand(id);
        var result = await _sender.Send(command, ct);
        return ToActionResult(result);
    }

    /// <summary>
    /// Obtiene resumen de documentos de una propiedad.
    /// </summary>
    [HttpGet("summary/by-property/{propertyId:guid}")]
    public async Task<IActionResult> GetSummaryByProperty(Guid propertyId, CancellationToken ct)
    {
        var query = new GetDocumentSummaryByPropertyQuery(propertyId);
        var result = await _sender.Send(query, ct);
        return ToActionResult(result);
    }

    /// <summary>
    /// Obtiene árbol (carpetas y documentos) de una propiedad.
    /// </summary>
    [HttpGet("tree/by-property/{propertyId:guid}")]
    public async Task<IActionResult> GetTreeByProperty(Guid propertyId, CancellationToken ct)
    {
        var query = new GetDocumentTreeByPropertyQuery(propertyId);
        var result = await _sender.Send(query, ct);
        return ToActionResult(result);
    }

    private IActionResult ToActionResult<T>(Result<T> result, Func<T, IActionResult>? onSuccess = null)
    {
        if (result.IsSuccess)
        {
            var value = result.Value!;
            return onSuccess is not null ? onSuccess(value) : Ok(value);
        }

        var problem = new ProblemDetails
        {
            Title = "Operación fallida",
            Detail = result.Error!.Message,
            Status = StatusCodes.Status400BadRequest
        };
        problem.Extensions["code"] = result.Error.Code;

        return BadRequest(problem);
    }
}