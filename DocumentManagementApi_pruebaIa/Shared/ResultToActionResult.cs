using DocManagApi_pruebaIa.Application.Common.Results;
using Microsoft.AspNetCore.Mvc;

namespace DocumentManagementApi_pruebaIa.Shared;

public static class ResultToActionResult
{
    public static ActionResult<T> ToActionResult<T>(ControllerBase controller, Result<T> result)
    {
        if (result.IsSuccess)
            return controller.Ok(result.Value);

        var code = result.Error?.Code ?? "Unknown";
        var message = result.Error?.Message ?? "Error desconocido";

        return code switch
        {
            var c when c.EndsWith(".NotFound", StringComparison.OrdinalIgnoreCase) => controller.NotFound(new { code, message }),

            var c when c.Contains("Permission", StringComparison.OrdinalIgnoreCase) && c.Contains("Denied", StringComparison.OrdinalIgnoreCase) => controller.Forbid(),

            var c when c.Contains("Conflict", StringComparison.OrdinalIgnoreCase) || c.Contains("Max", StringComparison.OrdinalIgnoreCase) => controller.StatusCode(409, new { code, message }),

            _ => controller.BadRequest(new { code, message }),
        };
    }
}