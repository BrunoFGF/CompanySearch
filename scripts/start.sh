#!/bin/bash
echo "🚀 Iniciando Company Search Application..."
echo "📦 Construyendo y levantando contenedores..."

docker-compose up --build -d

echo "⏳ Esperando a que los servicios estén listos..."
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
echo "📝 Para ver logs: docker-compose logs -f"
echo "🛑 Para detener: ./scripts/stop.sh"