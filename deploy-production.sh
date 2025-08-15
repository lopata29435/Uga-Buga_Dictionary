#!/bin/bash

echo "🚀 Развертывание словаря Уга-Бунга на продакшен сервере..."

# Останавливаем существующие контейнеры
echo "📦 Останавливаем старые контейнеры..."
docker-compose down

# Собираем образы для продакшена
echo "🔨 Собираем образы для продакшена..."
docker-compose build --no-cache

# Запускаем все сервисы
echo "🌟 Запускаем все сервисы..."
docker-compose up -d

echo "✅ Развертывание завершено!"
echo ""
echo "📍 Сервисы запущены:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:8080"
echo "   🗄️ PostgreSQL: localhost:5432"
echo ""
echo "📝 Следующие шаги:"
echo "   1. Скопируйте содержимое /var/lib/docker/volumes/demo_frontend_dist/_data"
echo "   2. В директорию /var/www/lopata.su/react/uga-buga_dictionary/"
echo "   3. Обновите nginx конфигурацию"
echo ""
echo "📊 Проверить статус: docker-compose ps"
echo "📝 Посмотреть логи: docker-compose logs -f"
