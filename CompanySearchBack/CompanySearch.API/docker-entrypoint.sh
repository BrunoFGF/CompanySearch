echo "🚀 Iniciando Company Search API..."

# Variables de entorno
SA_PASSWORD=${SA_PASSWORD:-MyStrongPass123!}
DB_NAME=${DB_NAME:-CompanySearchDB}

echo "📡 Esperando a que SQL Server esté disponible..."

# Función para verificar si SQL Server está disponible
wait_for_sql() {
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if sqlcmd -S sqlserver -U sa -P "$SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; then
            echo "✅ SQL Server está disponible!"
            return 0
        fi
        
        echo "⏳ Intento $attempt/$max_attempts - SQL Server no disponible aún..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Error: SQL Server no disponible después de $max_attempts intentos"
    return 1
}

# Función para verificar si la base de datos existe
check_database() {
    sqlcmd -S sqlserver -U sa -P "$SA_PASSWORD" -Q "SELECT name FROM sys.databases WHERE name = '$DB_NAME'" -h-1 | grep -q "$DB_NAME"
}

# Función para ejecutar el script de inicialización
init_database() {
    echo "🗄️ Inicializando base de datos..."
    if [ -f "/app/scripts/01-init.sql" ]; then
        sqlcmd -S sqlserver -U sa -P "$SA_PASSWORD" -i /app/scripts/01-init.sql
        if [ $? -eq 0 ]; then
            echo "✅ Base de datos inicializada correctamente!"
        else
            echo "❌ Error al inicializar la base de datos"
            return 1
        fi
    else
        echo "⚠️ No se encontró el script de inicialización"
    fi
}

# Esperar a SQL Server
if ! wait_for_sql; then
    echo "❌ No se pudo conectar a SQL Server. Iniciando API de todos modos..."
fi

# Verificar si la base de datos ya existe
if check_database; then
    echo "ℹ️ Base de datos '$DB_NAME' ya existe, omitiendo inicialización."
else
    echo "📝 Base de datos '$DB_NAME' no encontrada, ejecutando inicialización..."
    if ! init_database; then
        echo "⚠️ Error en la inicialización, pero continuando..."
    fi
fi

echo "🌐 Iniciando aplicación .NET..."
exec dotnet CompanySearch.API.dll