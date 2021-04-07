data "aws_s3_bucket_object" "code_hash" {
  bucket = data.terraform_remote_state.bootstrap.outputs.code_bucket
  key    = "${var.app_version}/code.zip"
}

resource "aws_lambda_function" "wasserstandinfo_prefetch" {
  function_name = "wasserstandinfo-prefetch-${local.env_name}"
  description   = "Lambda for fetching station-data and uploading that data to s3"

  s3_bucket = data.terraform_remote_state.bootstrap.outputs.code_bucket
  s3_key    = "${var.app_version}/code.zip"

  handler = "index.handler"
  runtime = "nodejs14.x"

  role = aws_iam_role.lambda.arn

  publish                        = false
  reserved_concurrent_executions = 1
  source_code_hash               = data.aws_s3_bucket_object.code_hash.body
  timeout                        = 3
  environment {
    variables = {
      UPLOAD_BUCKET_NAME = aws_s3_bucket.stations.bucket
      STATIONS_OBJECT_KEY_NAME = "stations.json"
    }
  }

  tags = local.common_tags
}