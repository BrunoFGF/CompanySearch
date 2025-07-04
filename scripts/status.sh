echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "💾 Uso de volúmenes:"
docker volume ls | grep company-search

echo ""
echo "🌐 Red:"
docker network ls | grep company-search