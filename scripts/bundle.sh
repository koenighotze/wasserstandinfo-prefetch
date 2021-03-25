#!/usr/bin/env bash
set -eu

: "${BUCKET_NAME?BUCKET_NAME var missing}"

APP_VERSION=$(grep version package.json | cut -d: -f2 | sed 's/[", ]//g')

npm run clean 
npm test
npm run lint

temp_dir=$(mktemp -d)

cp -rvf src index.js package.json package-lock.json "$temp_dir" 
pushd "$temp_dir"
npm ci --production -q
zip -r -1 ../code.zip *
popd

aws s3 cp code.zip "s3://${BUCKET_NAME}/${APP_VERSION}/"