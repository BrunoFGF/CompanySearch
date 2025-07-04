echo "🧹 Limpiando Company Search Application..."
echo "⚠️  Esto eliminará todos los contenedores, volúmenes e imágenes relacionadas."
echo "⚠️  Se perderán todos los datos almacenados."
echo ""
read -p "¿Estás seguro? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Deteniendo y eliminando contenedores..."
    docker-compose down -v
    
    echo "🗑️ Eliminando imágenes..."
    docker-compose down --rmi all
    
    echo "🗑️ Limpiando sistema Docker..."
    docker system prune -f
    
    echo "✅ Limpieza completada."
else
    echo "❌ Operación cancelada."
fi