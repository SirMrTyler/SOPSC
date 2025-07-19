using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Messages;

/// <summary>
/// Request model for deleting one or more messages.
/// </summary>
public class DeleteMessagesRequest
{
    [Required]
    public List<int> MessageIds { get; set; }
}