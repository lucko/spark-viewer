#!/bin/sh
echo "Replacing BYTEBIN_URL with ${BYTEBIN_URL} ..."
sed -i "s#https://bytebin.lucko.me/#${BYTEBIN_URL}#g" /app/.next/static/chunks/*.js
echo "Done."
exec "$@"
