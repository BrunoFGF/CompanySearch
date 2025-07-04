echo "🚀 Iniciando Company Search Application..."

# Verificar que el archivo .env existe
if [ ! -f .env ]; then
    echo "❌ Error: No se encontró el archivo .env"
    echo "📝 Crea el archivo .env con las variables necesarias"
    exit 1
fi

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "🐳 Por favor, inicia Docker Desktop y vuelve a intentar"
    exit 1
fi

echo "📦 Deteniendo contenedores existentes..."
docker-compose down

echo "🏗️ Construyendo y levantando contenedores..."
docker-compose up --build -d

echo "⏳ Esperando a que los servicios estén listos..."
echo "   📊 Verificando SQL Server..."
timeout=60
counter=0
while ! docker-compose exec -T sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MyStrongPass123!" -Q "SELECT 1" > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout esperando SQL Server"
        exit 1
    fi
    echo "   ⏳ SQL Server iniciando... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

echo "   ⚡ Verificando Redis..."
timeout=30
counter=0
while ! docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout esperando Redis"
        exit 1
    fi
    echo "   ⏳ Redis iniciando... ($counter/$timeout)"
    sleep 1
    counter=$((counter + 1))
done

echo "   🌐 Verificando API..."
sleep 10

echo "🔍 Verificando estado de los contenedores..."
docker-compose ps

echo ""
echo "✅ ¡Aplicación iniciada exitosamente!"
echo "📋 Servicios disponibles:"
echo "   🌐 API: http://localhost:5000"
echo "   📊 Swagger: http://localhost:5000/swagger"
echo "   🗄️  SQL Server: localhost:1434"
echo "   ⚡ Redis: localhost:6379"
echo ""
echo "📝 Comandos útiles:"
echo "   📋 Ver logs: docker-compose logs -f"
echo "   📋 Ver logs API: docker-compose logs -f api"
echo "   🛑 Detener: ./scripts/stop.sh"
echo ""
echo "⚠️  Si hay problemas, verifica los logs con: docker-compose logs"