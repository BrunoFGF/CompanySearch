FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de proyecto con la estructura actual
COPY ["CompanySearch.API/CompanySearch.API.csproj", "CompanySearch.API/"]
COPY ["CompanySearch.Infrastructure/CompanySearch.Infrastructure.csproj", "CompanySearch.Infrastructure/"]

# Restaurar dependencias
RUN dotnet restore "CompanySearch.API/CompanySearch.API.csproj"

# Copiar todo el código fuente
COPY . .

# Construir aplicación
WORKDIR "/src/CompanySearch.API"
RUN dotnet build "CompanySearch.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CompanySearch.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Usuario no-root para seguridad
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "CompanySearch.API.dll"]

FROM build AS publish
RUN dotnet publish "CompanySearch.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Usuario no-root para seguridad
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

ENTRYPOINT ["dotnet", "CompanySearch.API.dll"]