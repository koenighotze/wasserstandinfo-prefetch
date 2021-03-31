#!/usr/bin/env bash
set -eu

: "${BUCKET_NAME?BUCKET_NAME var missing}"

APP_DEFAULT_VERSION=$(grep version package.json | cut -d: -f2 | sed 's/[", ]//g')
: ${APP_VERSION:=$APP_DEFAULT_VERSION}

temp_dir="temp-build-$$"
mkdir "$temp_dir"
cp -rvf src index.js package.json package-lock.json "$temp_dir" 
pushd "$temp_dir"
npm ci --production -q
zip -q -r -1 ../code.zip ./*
popd

echo "Uploading code in version ${APP_VERSION} to bucket ${BUCKET_NAME}"

aws s3 cp code.zip "s3://${BUCKET_NAME}/${APP_VERSION}/"