#!/bin/bash

# 确保脚本在错误时停止
set -e

# 创建临时目录
echo "Creating temporary directory..."
mkdir -p temp_build

# 复制必要文件
echo "Copying files..."
cp -r src temp_build/
cp -r assets temp_build/
cp manifest.json temp_build/
cp LICENSE temp_build/
cp README.md temp_build/

# 进入临时目录
cd temp_build

# 创建zip文件
echo "Creating ZIP file..."
zip -r ../tab-content-search.zip .

# 返回上级目录
cd ..

# 清理临时文件
echo "Cleaning up..."
rm -rf temp_build

echo "Build complete! Output: tab-content-search.zip" 