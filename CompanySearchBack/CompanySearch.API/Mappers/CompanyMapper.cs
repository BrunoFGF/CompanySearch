using CompanySearch.API.DTOs;
using CompanySearch.Infrastructure.Models;
using System.Text.Json;
namespace CompanySearch.API.Mappers
{
    public static class CompanyMapper
    {
        public static CompanyDto ToDto(Company company)
        {
            return new CompanyDto
            {
                Id = company.Id,
                Name = company.Name,
                Addresses = ParseJsonArray(company.Addresses),
                Countries = ParseJsonArray(company.Countries)
            };
        }
        public static List<CompanyDto> ToDto(IEnumerable<Company> companies)
        {
            return companies.Select(ToDto).ToList();
        }

        public static string SerializeJsonArray(List<string> stringList)
        {
            try
            {
                if (stringList == null || !stringList.Any())
                    return "[]";
                return JsonSerializer.Serialize(stringList);
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error serializing JSON: {ex.Message}");
                return "[]";
            }
        }
        private static List<string> ParseJsonArray(string jsonString)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(jsonString) || jsonString == "[]")
                    return new List<string>();
                return JsonSerializer.Deserialize<List<string>>(jsonString) ?? new List<string>();
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error parsing JSON: {ex.Message}");
                return new List<string>();
            }
        }
    }
}