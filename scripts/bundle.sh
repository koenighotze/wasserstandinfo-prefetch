#!/usr/bin/env bash
set -eu

APP_DEFAULT_VERSION=$(grep version package.json | cut -d: -f2 | sed 's/[", ]//g')
: "${APP_VERSION:="$APP_DEFAULT_VERSION"}"

pushd provision/bootstrap
BUCKET_NAME=$(terraform show -json | jq -r '.values.outputs.code_bucket.value')
popd

CODE_FILE_NAME="code-${GITHUB_SHA}.zip"
echo "Uploading ${CODE_FILE_NAME} in to bucket ${BUCKET_NAME}/${APP_VERSION}"

temp_dir="temp-build-$$"
mkdir "$temp_dir"
cp -rf src index.js package.json package-lock.json "$temp_dir" 
pushd "$temp_dir"
npm ci --production -q
zip -q -r -1 "../${CODE_FILE_NAME}" ./*
popd

aws s3 cp "${CODE_FILE_NAME}" "s3://${BUCKET_NAME}/${APP_VERSION}/"