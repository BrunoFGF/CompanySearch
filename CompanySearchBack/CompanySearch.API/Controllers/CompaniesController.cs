using CompanySearch.API.DTOs;
using CompanySearch.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CompanySearch.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly ILogger<CompaniesController> _logger;

        public CompaniesController(ICompanyService companyService, ILogger<CompaniesController> logger)
        {
            _companyService = companyService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<ActionResult<CompanySearchResponse>> SearchCompanies(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? nameFilter = null,
            [FromQuery] string? addressFilter = null,
            [FromQuery] string? countryFilter = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var request = new CompanySearchRequest
                {
                    SearchTerm = searchTerm,
                    NameFilter = nameFilter,
                    AddressFilter = addressFilter,
                    CountryFilter = countryFilter,
                    Page = page,
                    PageSize = pageSize
                };

                var response = await _companyService.SearchCompaniesAsync(request);

                _logger.LogInformation("Search completed. General: {SearchTerm}, Name: {NameFilter}, Address: {AddressFilter}, Country: {CountryFilter}, Results: {Count}, Page: {Page}",
                    searchTerm, nameFilter, addressFilter, countryFilter, response.TotalCount, page);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SearchCompanies endpoint");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("search/names")]
        public async Task<ActionResult<CompanyNamesSearchResponse>> SearchCompanyNames(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? addressFilter = null,
            [FromQuery] string? countryFilter = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                if (string.IsNullOrEmpty(searchTerm) && string.IsNullOrEmpty(addressFilter) && string.IsNullOrEmpty(countryFilter))
                {
                    return BadRequest(new { message = "Al menos un filtro es requerido para búsqueda de nombres" });
                }

                var request = new CompanySearchRequest
                {
                    SearchTerm = searchTerm,
                    AddressFilter = addressFilter,
                    CountryFilter = countryFilter,
                    Page = page,
                    PageSize = pageSize
                };

                var response = await _companyService.SearchCompanyNamesAsync(request);

                _logger.LogInformation("Names search completed. General: {SearchTerm}, Address: {AddressFilter}, Country: {CountryFilter}, Results: {Count}, Page: {Page}",
                    searchTerm, addressFilter, countryFilter, response.TotalCount, page);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SearchCompanyNames endpoint");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyDto>> GetCompanyById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "ID debe ser mayor a 0" });
                }

                var company = await _companyService.GetCompanyByIdAsync(id);

                if (company == null)
                {
                    return NotFound(new { message = $"Compañía con ID {id} no encontrada" });
                }

                return Ok(company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting company with ID: {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<CompanySearchResponse>> GetAllCompanies(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            return await SearchCompanies(null, null, null, null, page, pageSize);
        }

        [HttpPost]
        public async Task<ActionResult<CompanyDto>> CreateCompany([FromBody] CreateCompanyDto createCompanyDto)
        {
            try
            {
                if (createCompanyDto == null)
                {
                    return BadRequest(new { message = "Datos de la compañía son requeridos" });
                }

                var createdCompany = await _companyService.CreateCompanyAsync(createCompanyDto);

                _logger.LogInformation("Company created successfully with ID: {Id}", createdCompany.Id);

                return CreatedAtAction(
                    nameof(GetCompanyById),
                    new { id = createdCompany.Id },
                    createdCompany);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateCompany endpoint");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CompanyDto>> UpdateCompany(int id, [FromBody] UpdateCompanyDto updateCompanyDto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "ID debe ser mayor a 0" });
                }

                if (updateCompanyDto == null)
                {
                    return BadRequest(new { message = "Datos de actualización son requeridos" });
                }

                var updatedCompany = await _companyService.UpdateCompanyAsync(id, updateCompanyDto);

                if (updatedCompany == null)
                {
                    return NotFound(new { message = $"Compañía con ID {id} no encontrada" });
                }

                _logger.LogInformation("Company updated successfully with ID: {Id}", id);

                return Ok(updatedCompany);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCompany endpoint for ID: {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCompany(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "ID debe ser mayor a 0" });
                }

                var deleted = await _companyService.DeleteCompanyAsync(id);

                if (!deleted)
                {
                    return NotFound(new { message = $"Compañía con ID {id} no encontrada" });
                }

                _logger.LogInformation("Company deleted successfully with ID: {Id}", id);

                return Ok(new { message = $"Compañía con ID {id} eliminada exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCompany endpoint for ID: {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}