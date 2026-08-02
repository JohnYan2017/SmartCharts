#!/bin/bash
# 部署 H5 构建产物到 SmartChart Django 项目
# 用法: ./scripts/deploy-h5.sh

set -e

DJANGO_DIR="$(dirname "$0")/../.."
BUILD_DIR="$(dirname "$0")/../dist/build/h5"
STATIC_TARGET="$DJANGO_DIR/static/mobile"
TEMPLATE_TARGET="$DJANGO_DIR/templates/mobile"

# 检查构建产物
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ 构建产物不存在: $BUILD_DIR"
    echo "请先执行: npm run build:h5"
    exit 1
fi

echo "📦 开始部署 H5 到 Django 项目..."
echo "   源: $BUILD_DIR"
echo "   目标: $DJANGO_DIR"

# 清理旧的静态资源并拷贝新的
rm -rf "$STATIC_TARGET"
mkdir -p "$STATIC_TARGET"
cp -R "$BUILD_DIR/assets" "$STATIC_TARGET/assets"
cp -R "$BUILD_DIR/static" "$STATIC_TARGET/static"
echo "✅ 静态资源 → $STATIC_TARGET"

# 创建模板目录并拷贝 index.html
mkdir -p "$TEMPLATE_TARGET"
cp "$BUILD_DIR/index.html" "$TEMPLATE_TARGET/index.html"
echo "✅ 入口模板 → $TEMPLATE_TARGET/index.html"

echo ""
echo "🎉 部署完成！访问 http://your-domain/m/ 进入移动端"
