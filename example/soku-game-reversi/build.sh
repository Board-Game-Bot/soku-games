#!/usr/bin/env sh

npx vite build -m core
npx vite build -m screen

mkdir dist
mkdir dist/core dist/screen

mv dist-core/* dist/core/
mv dist-screen/* dist/screen/

rm -rf dist-core dist-screen
