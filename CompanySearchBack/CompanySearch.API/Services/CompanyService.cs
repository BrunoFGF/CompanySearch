using CompanySearch.Infrastructure.DB;
using CompanySearch.API.Mappers;
using Microsoft.EntityFrameworkCore;
using CompanySearch.API.DTOs;
using CompanySearch.API.Services.Interfaces;
using CompanySearch.Infrastructure.Models;

namespace CompanySearch.API.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly CompanySearchDbContext _context;
        private readonly ICacheService _cacheService;
        private readonly ILogger<CompanyService> _logger;

        public CompanyService(CompanySearchDbContext context, ICacheService cacheService, ILogger<CompanyService> logger)
        {
            _context = context;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<CompanySearchResponse> SearchCompaniesAsync(CompanySearchRequest request)
        {
            try
            {
                var cacheKey = $"company_search:{request.SearchTerm?.ToLower() ?? "all"}:{request.Page}:{request.PageSize}";

                var cachedResult = await _cacheService.GetAsync<CompanySearchResponse>(cacheKey);
                if (cachedResult != null)
                {
                    _logger.LogInformation("Cache HIT - Returning cached results for search: {SearchTerm}", request.SearchTerm);
                    return cachedResult;
                }

                _logger.LogInformation("Cache MISS - Querying database for search: {SearchTerm}", request.SearchTerm);

                var query = _context.Companies.AsQueryable();

                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    var searchTerm = request.SearchTerm.ToLower().Trim();
                    query = query.Where(c =>
                        c.Name.ToLower().Contains(searchTerm) ||
                        c.Addresses.ToLower().Contains(searchTerm) ||
                        c.Countries.ToLower().Contains(searchTerm)
                    );
                }

                var totalCount = await query.CountAsync();

                var pageSize = Math.Min(request.PageSize, 100);

                var companies = await query
                    .OrderBy(c => c.Id)
                    .Skip((request.Page - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync();

                var companyDtos = CompanyMapper.ToDto(companies);

                var response = new CompanySearchResponse
                {
                    Companies = companyDtos,
                    TotalCount = totalCount,
                    Page = request.Page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                await _cacheService.SetAsync(cacheKey, response, TimeSpan.FromMinutes(5));

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching companies with term: {SearchTerm}", request.SearchTerm);
                throw;
            }
        }

        public async Task<CompanyNamesSearchResponse> SearchCompanyNamesAsync(CompanySearchRequest request)
        {
            try
            {
                var cacheKey = $"company_names:{request.SearchTerm?.ToLower() ?? "all"}:{request.Page}:{request.PageSize}";

                var cachedResult = await _cacheService.GetAsync<CompanyNamesSearchResponse>(cacheKey);
                if (cachedResult != null)
                {
                    _logger.LogInformation("Cache HIT - Returning cached names for search: {SearchTerm}", request.SearchTerm);
                    return cachedResult;
                }

                _logger.LogInformation("Cache MISS - Querying database for names search: {SearchTerm}", request.SearchTerm);

                var query = _context.Companies.AsQueryable();

                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    var searchTerm = request.SearchTerm.ToLower().Trim();
                    query = query.Where(c =>
                        c.Addresses.ToLower().Contains(searchTerm) ||
                        c.Countries.ToLower().Contains(searchTerm)
                    );
                }

                var totalCount = await query.CountAsync();

                var pageSize = Math.Min(request.PageSize, 100);

                var companies = await query
                    .Select(c => new Company { Id = c.Id, Name = c.Name })
                    .OrderBy(c => c.Id)
                    .Skip((request.Page - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync();

                var companyNames = CompanyMapper.ToNameDto(companies);

                var response = new CompanyNamesSearchResponse
                {
                    Companies = companyNames,
                    TotalCount = totalCount,
                    Page = request.Page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                await _cacheService.SetAsync(cacheKey, response, TimeSpan.FromMinutes(10));

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching company names with term: {SearchTerm}", request.SearchTerm);
                throw;
            }
        }

        public async Task<CompanyDto?> GetCompanyByIdAsync(int id)
        {
            try
            {
                var cacheKey = $"company_id:{id}";

                var cachedResult = await _cacheService.GetAsync<CompanyDto>(cacheKey);
                if (cachedResult != null)
                {
                    _logger.LogInformation("Cache HIT - Returning cached company for ID: {Id}", id);
                    return cachedResult;
                }

                _logger.LogInformation("Cache MISS - Querying database for company ID: {Id}", id);

                var company = await _context.Companies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (company != null)
                {
                    var companyDto = CompanyMapper.ToDto(company);

                    await _cacheService.SetAsync(cacheKey, companyDto, TimeSpan.FromMinutes(15));

                    return companyDto;
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting company with ID: {Id}", id);
                throw;
            }
        }

        public async Task<CompanyDto> CreateCompanyAsync(CreateCompanyDto createCompanyDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(createCompanyDto.Name))
                {
                    throw new ArgumentException("El nombre de la compañía es requerido");
                }

                var company = new Company
                {
                    Name = createCompanyDto.Name.Trim(),
                    Addresses = CompanyMapper.SerializeJsonArray(createCompanyDto.Addresses),
                    Countries = CompanyMapper.SerializeJsonArray(createCompanyDto.Countries)
                };

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Company created successfully with ID: {Id}, Name: {Name}", company.Id, company.Name);

                await _cacheService.RemoveByPatternAsync("company_search:*");
                await _cacheService.RemoveByPatternAsync("company_names:*");

                return CompanyMapper.ToDto(company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating company with name: {Name}", createCompanyDto.Name);
                throw;
            }
        }

        public async Task<CompanyDto?> UpdateCompanyAsync(int id, UpdateCompanyDto updateCompanyDto)
        {
            try
            {
                var existingCompany = await _context.Companies.FindAsync(id);

                if (existingCompany == null)
                {
                    _logger.LogWarning("Company with ID {Id} not found for update", id);
                    return null;
                }

                if (!string.IsNullOrWhiteSpace(updateCompanyDto.Name))
                {
                    existingCompany.Name = updateCompanyDto.Name.Trim();
                }

                if (updateCompanyDto.Addresses != null)
                {
                    existingCompany.Addresses = CompanyMapper.SerializeJsonArray(updateCompanyDto.Addresses);
                }

                if (updateCompanyDto.Countries != null)
                {
                    existingCompany.Countries = CompanyMapper.SerializeJsonArray(updateCompanyDto.Countries);
                }

                _context.Companies.Update(existingCompany);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Company updated successfully. ID: {Id}, Name: {Name}", id, existingCompany.Name);

                _logger.LogInformation("Clearing cache for updated company ID: {Id}", id);

                await _cacheService.RemoveAsync($"company_id:{id}");

                _logger.LogInformation("Clearing all search caches due to company update");
                await _cacheService.RemoveByPatternAsync("company_search:*");
                await _cacheService.RemoveByPatternAsync("company_names:*");

                return CompanyMapper.ToDto(existingCompany);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating company with ID: {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteCompanyAsync(int id)
        {
            try
            {
                var existingCompany = await _context.Companies.FindAsync(id);

                if (existingCompany == null)
                {
                    _logger.LogWarning("Company with ID {Id} not found for deletion", id);
                    return false;
                }

                _context.Companies.Remove(existingCompany);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Company deleted successfully. ID: {Id}, Name: {Name}", id, existingCompany.Name);

                await _cacheService.RemoveAsync($"company_id:{id}");
                await _cacheService.RemoveByPatternAsync("company_search:*");
                await _cacheService.RemoveByPatternAsync("company_names:*");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting company with ID: {Id}", id);
                throw;
            }
        }
    }
}