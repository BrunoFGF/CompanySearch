namespace CompanySearch.Infrastructure.Models;

public partial class Company
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Addresses { get; set; } = null!;

    public string Countries { get; set; } = null!;
}
