namespace CompanySearch.API.DTOs
{
    public class CompanyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<string> Addresses { get; set; } = new();
        public List<string> Countries { get; set; } = new();
    }

    public class CreateCompanyDto
    {
        public string Name { get; set; } = string.Empty;
        public List<string> Addresses { get; set; } = new();
        public List<string> Countries { get; set; } = new();
    }
    public class UpdateCompanyDto
    {
        public string? Name { get; set; }
        public List<string>? Addresses { get; set; }
        public List<string>? Countries { get; set; }
    }
    public class CompanyNameDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
    public class CompanySearchRequest
    {
        public string? SearchTerm { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
    public class CompanySearchResponse
    {
        public List<CompanyDto> Companies { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class CompanyNamesSearchResponse
    {
        public List<CompanyNameDto> Companies { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}