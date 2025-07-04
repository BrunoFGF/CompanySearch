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

# Instalar SQL Server tools para ejecutar scripts de inicialización
USER root
RUN apt-get update \
    && apt-get install -y curl gnupg2 \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Agregar mssql-tools al PATH
ENV PATH="$PATH:/opt/mssql-tools/bin"

# Copiar y configurar el script de entrada
COPY CompanySearch.API/docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Volver al usuario no-root
USER $APP_UID

ENTRYPOINT ["/app/docker-entrypoint.sh"]