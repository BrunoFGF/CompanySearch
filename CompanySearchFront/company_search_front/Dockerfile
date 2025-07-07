# Etapa 1: Construcción
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Instalar TODAS las dependencias 
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Construir la aplicación
RUN npm run build

# Etapa 2: Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]