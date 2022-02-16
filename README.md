# Wasserstand info prefetch

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/248b9a679ff243c1acd47f79be823ea1)](https://www.codacy.com/gh/koenighotze/wasserstandinfo-prefetch/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=koenighotze/wasserstandinfo-prefetch\&utm_campaign=Badge_Grade)
[![CI](https://github.com/koenighotze/wasserstandinfo-prefetch/actions/workflows/ci.yml/badge.svg)](https://github.com/koenighotze/wasserstandinfo-prefetch/actions/workflows/ci.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7f1df715383445979b8b6a51e6a9d7a7)](https://www.codacy.com/gh/koenighotze/wasserstandinfo-prefetch/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=koenighotze/wasserstandinfo-prefetch\&utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/7f1df715383445979b8b6a51e6a9d7a7)](https://www.codacy.com/gh/koenighotze/wasserstandinfo-prefetch/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=koenighotze/wasserstandinfo-prefetch\&utm_campaign=Badge_Coverage)
[![CodeQL](https://github.com/koenighotze/wasserstandinfo-prefetch/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/koenighotze/wasserstandinfo-prefetch/actions/workflows/codeql-analysis.yml)

## Overview

TODO

## Architecture

The following diagram show the link between the different parts of the Wasserstand-prefetch

```mermaid
  graph TD;
      AWSLambda --> WasserstandinfoPrefetch;
      WasserstandinfoPrefetch --> S3Bucket;
      S3Bucket --> AlexaWasserstandinfoSkill;
```

```mermaid
  sequenceDiagram
    participant AWS-Lambda
    participant Wasserstandinfo-Prefetch
    participant Weather-station
    participant S3-Bucket
    participant Alexa-Wasserstandinfo-Skill

    AWS-Lambda->>Wasserstandinfo-Prefetch: Triggers per schedule
    Wasserstandinfo-Prefetch->>Weather-station: fetch station data
    Weather-station-->>Wasserstandinfo-Prefetch: station.json
    Wasserstandinfo-Prefetch->>S3-Bucket: Upload station data
    Alexa-Wasserstandinfo-Skill->>S3-Bucket: Uses station data
```

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

## Getting started

*   Run ./provision/bootstrap (only needed once)
*   Export the output code-bucket value as BUCKET_NAME
*   Upload code using ./scripts/bundle.sh
*   Run ./provision/function

## Running the integration tests

You need to set the following environment variables:

*   STATIONS_BUCKET_NAME: the name of the bucket
*   STATIONS_OBJECT_KEY_NAME: the name of the object containing the station data
*   LAMBDA_FUNCTION_NAME: the name of the lamba

The values must match the lambda under test. Suppose the lambda is called `wasserstandinfo-prefetch-dev`, you can check the other values with a command like the following:

```bash
$ aws lambda get-function --function-name wasserstandinfo-prefetch-dev | jq '.Configuration.Environment.Variables'
{
  "UPLOAD_BUCKET_NAME": "some-bucket-name",
  "STATIONS_OBJECT_KEY_NAME": "stations.json"
}
```

After you have set the environment variables, run the integration tests

```bash
$ npm run test.integration
...
PASS integration-tests/end-to-end.test.js
  End to end
    ✓ should load the station data into the bucket (3364 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.251 s, estimated 5 s
Ran all test suites.
```
