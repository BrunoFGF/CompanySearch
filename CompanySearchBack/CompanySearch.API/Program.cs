using CompanySearch.API.Services;
using CompanySearch.API.Services.Interfaces;
using CompanySearch.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddDbContext<CompanySearchDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var redisConnectionString = builder.Configuration.GetConnectionString("Redis");

builder.Services.AddSingleton<IConnectionMultiplexer>(provider =>
    ConnectionMultiplexer.Connect(redisConnectionString!));

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "Companies_";
});

builder.Services.AddScoped<ICacheService, CacheService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", 
                "http://localhost:3001",  
                "http://127.0.0.1:3000"  
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwagger();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();  
app.UseAuthorization();
app.MapControllers();

app.Run();