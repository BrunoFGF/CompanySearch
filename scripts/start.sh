echo "🚀 Iniciando Company Search Application (Full Stack)..."

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    exit 1
fi

echo "🧹 Limpiando contenedores anteriores..."
docker-compose down -v

echo "🏗️ Construyendo y levantando contenedores..."
docker-compose up --build -d

echo "⏳ Esperando a que los servicios estén listos..."
sleep 20

echo "🔍 Verificando estado de los contenedores..."
docker-compose ps

echo ""
echo "✅ ¡Aplicación iniciada exitosamente!"
echo "📋 Servicios disponibles:"
echo "   🌐 Frontend:     http://localhost:3000"
echo "   🔧 API:          http://localhost:5000"
echo "   🗄️  SQL Server:   localhost:1435"
echo "   ⚡ Redis:        localhost:6380"
echo ""
echo "📝 Comandos útiles:"
echo "   📋 Ver logs: docker-compose logs -f"
echo "   🛑 Detener: ./scripts/stop.sh"