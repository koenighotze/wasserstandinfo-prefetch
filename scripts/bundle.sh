#!/usr/bin/env bash

set -eu

npm run clean 
npm test
npm run lint

temp_dir=tmp #$(mktmp)

cp -rvf src/ index.js package.json package-lock.json "$temp_dir" 
pushd "$temp_dir"
npm ci
popd