using System.Text.Json;
using CompanySearch.API.Services.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace CompanySearch.API.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _distributedCache;
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        private readonly ILogger<CacheService> _logger;
        private readonly string _instanceName;

        public CacheService(
            IDistributedCache distributedCache,
            IConnectionMultiplexer connectionMultiplexer,
            ILogger<CacheService> logger,
            IConfiguration configuration)
        {
            _distributedCache = distributedCache;
            _connectionMultiplexer = connectionMultiplexer;
            _logger = logger;
            // El InstanceName se configura en Program.cs como "Companies_"
            _instanceName = "Companies_";
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            try
            {
                var cachedValue = await _distributedCache.GetStringAsync(key);
                if (string.IsNullOrEmpty(cachedValue))
                {
                    _logger.LogDebug("Cache MISS for key: {Key}", key);
                    return null;
                }
                _logger.LogDebug("Cache HIT for key: {Key}", key);
                return JsonSerializer.Deserialize<T>(cachedValue);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting value from cache for key: {Key}", key);
                return null;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            try
            {
                var options = new DistributedCacheEntryOptions();
                if (expiry.HasValue)
                {
                    options.SetAbsoluteExpiration(expiry.Value);
                }
                else
                {
                    options.SetAbsoluteExpiration(TimeSpan.FromMinutes(5));
                }
                var jsonValue = JsonSerializer.Serialize(value);
                await _distributedCache.SetStringAsync(key, jsonValue, options);
                _logger.LogDebug("Cache SET for key: {Key}, expiry: {Expiry}", key, expiry ?? TimeSpan.FromMinutes(5));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting value in cache for key: {Key}", key);
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                await _distributedCache.RemoveAsync(key);
                _logger.LogDebug("Cache REMOVE for key: {Key}", key);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing value from cache for key: {Key}", key);
            }
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            try
            {
                var database = _connectionMultiplexer.GetDatabase();
                var server = _connectionMultiplexer.GetServer(_connectionMultiplexer.GetEndPoints().First());

                // Construir el patrón completo con el prefijo de instancia
                var fullPattern = $"{_instanceName}{pattern}";

                _logger.LogDebug("Searching for keys with pattern: {Pattern}", fullPattern);

                // Buscar todas las claves que coincidan con el patrón
                var keys = server.Keys(pattern: fullPattern).ToArray();

                if (keys.Length == 0)
                {
                    _logger.LogDebug("No keys found matching pattern: {Pattern}", fullPattern);
                    return;
                }

                _logger.LogDebug("Found {KeyCount} keys matching pattern: {Pattern}", keys.Length, fullPattern);

                // Eliminar las claves en lotes para mejor rendimiento
                const int batchSize = 100;
                var batches = keys.Chunk(batchSize);

                foreach (var batch in batches)
                {
                    await database.KeyDeleteAsync(batch);
                    _logger.LogDebug("Deleted batch of {BatchSize} keys", batch.Length);
                }

                _logger.LogInformation("Successfully removed {TotalKeys} keys matching pattern: {Pattern}", 
                    keys.Length, pattern);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing keys by pattern: {Pattern}", pattern);
                // No relanzamos la excepción para evitar que falle la operación principal
                // si solo falla la limpieza del cache
            }
        }

        // Método adicional para obtener información sobre las claves que coinciden con un patrón
        // (útil para debugging o monitoreo)
        public async Task<IEnumerable<string>> GetKeysByPatternAsync(string pattern)
        {
            try
            {
                var server = _connectionMultiplexer.GetServer(_connectionMultiplexer.GetEndPoints().First());
                
                var fullPattern = $"{_instanceName}{pattern}";

                var keys = server.Keys(pattern: fullPattern).Select(k => k.ToString()).ToList();
                
                _logger.LogDebug("Found {KeyCount} keys matching pattern: {Pattern}", keys.Count, fullPattern);
                
                return keys;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting keys by pattern: {Pattern}", pattern);
                return Enumerable.Empty<string>();
            }
        }
    }
}