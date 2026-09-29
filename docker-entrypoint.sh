#!/bin/sh
set -e

# Hanya migrasi schema. Data contoh diisi sekali lewat
# docker/mysql/init/*.sql saat volume MySQL pertama kali kosong.
# Jangan seed ulang di sini — agar data user tidak tertimpa/duplikat.
echo ">> Menjalankan migrasi database (schema only)..."
npx prisma migrate deploy

echo ">> Menjalankan server..."
exec npm start
