#!/usr/bin/env bash
set -eu

APP_DEFAULT_VERSION=$(grep version package.json | cut -d: -f2 | sed 's/[", ]//g')
: "${APP_VERSION:="$APP_DEFAULT_VERSION"}"

pushd provision/bootstrap
BUCKET_NAME=$(terraform show -json | jq -r '.values.outputs.code_bucket.value')
popd

temp_dir="temp-build-$$"
mkdir "$temp_dir"
cp -rf src index.js package.json package-lock.json "$temp_dir" 
pushd "$temp_dir"
npm ci --production -q
zip -q -r -1 ../code.zip ./*
popd

echo "Uploading code in version ${APP_VERSION} to bucket ${BUCKET_NAME}"
aws s3 cp --only-show-errors code.zip "s3://${BUCKET_NAME}/${APP_VERSION}/"