using CompanySearch.API.DTOs;

namespace CompanySearch.API.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<CompanySearchResponse> SearchCompaniesAsync(CompanySearchRequest request);
        Task<CompanyDto?> GetCompanyByIdAsync(int id);
        Task<CompanyDto> CreateCompanyAsync(CreateCompanyDto createCompanyDto);
        Task<CompanyDto?> UpdateCompanyAsync(int id, UpdateCompanyDto updateCompanyDto);
        Task<bool> DeleteCompanyAsync(int id);
    }
}