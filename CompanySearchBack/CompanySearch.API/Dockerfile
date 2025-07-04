# Imagen base para runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Imagen para compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto y restaurar dependencias
COPY ["CompanySearch.API/CompanySearch.API.csproj", "CompanySearch.API/"]
COPY ["CompanySearch.Infrastructure/CompanySearch.Infrastructure.csproj", "CompanySearch.Infrastructure/"]

RUN dotnet restore "CompanySearch.API/CompanySearch.API.csproj"

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación
WORKDIR "/src/CompanySearch.API"
RUN dotnet build "CompanySearch.API.csproj" -c Release -o /app/build

# Publicar la aplicación
FROM build AS publish
RUN dotnet publish "CompanySearch.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Ejecutar directamente la aplicación .NET
ENTRYPOINT ["dotnet", "CompanySearch.API.dll"]