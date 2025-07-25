#!/bin/bash

echo "🚀 Commit & push in progress..."

git add .

read -p "📝 Commit message: " message

git commit -m "$message"
git push origin main

echo "✅ Selesai push ke GitHub!"
