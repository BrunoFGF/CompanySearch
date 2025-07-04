#!/bin/bash

echo "Esperando a que SQL Server esté disponible..."

# Función para verificar si SQL Server está disponible
wait_for_sql() {
    while ! /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P ${SA_PASSWORD:-MyStrongPass123!} -Q "SELECT 1" > /dev/null 2>&1; do
        echo "SQL Server no está disponible aún... esperando"
        sleep 2
    done
    echo "SQL Server está disponible!"
}

# Función para verificar si la base de datos existe
check_database() {
    /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P ${SA_PASSWORD:-MyStrongPass123!} -Q "SELECT name FROM sys.databases WHERE name = 'CompanySearchDB'" -h-1 | grep -q "CompanySearchDB"
}

# Función para ejecutar el script de inicialización
init_database() {
    echo "Inicializando base de datos..."
    /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P ${SA_PASSWORD:-MyStrongPass123!} -i /app/scripts/01-init.sql
    echo "Base de datos inicializada correctamente!"
}

# Esperar a SQL Server
wait_for_sql

# Verificar si la base de datos ya existe
if ! check_database; then
    echo "Base de datos no encontrada, ejecutando inicialización..."
    init_database
else
    echo "Base de datos ya existe, omitiendo inicialización."
fi

echo "Iniciando aplicación .NET..."
exec dotnet CompanySearch.API.dll