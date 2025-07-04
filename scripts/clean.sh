echo "🧹 Limpiando Company Search Application..."
echo "⚠️  Esto eliminará todos los contenedores, volúmenes e imágenes."
read -p "¿Estás seguro? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v --rmi all
    docker system prune -f
    echo "✅ Limpieza completada."
else
    echo "❌ Operación cancelada."
fi