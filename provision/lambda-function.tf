resource "aws_lambda_function" "wasserstandinfo_prefetch" {
    function_name = "wasserstandinfo-prefetch-${local.env_name}"
    description = "Lambda for fetching station-data and uploading that data to s3"

    s3_bucket = aws_s3_bucket.code.name
    s3_key    = "${var.app_version}/code.zip"

    handler = "index.handler"
    runtime = "nodejs14.x"

    role = aws_iam_role.lambda.arn

    publish = false
    reserved_concurrent_executions = 1
    # source_code_hash = filebase64sha256("code.zip")
    timeout = 3
    variables = {

    }

    tags = local.common_tags
}