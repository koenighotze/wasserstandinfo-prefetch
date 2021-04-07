data "aws_iam_policy_document" "lambda_exec" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "allow_access_to_stations" {
  name = "allow-access-to-stations-role"

  policy = templatefile("allow-access-to-stations-policy.json", {
    resource_arn = "${aws_s3_bucket.stations.arn}/*"
  })
}

resource "aws_iam_role_policy_attachment" "basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda.name
}

resource "aws_iam_role" "lambda" {
  name = "wasserstandinfo-prefetch-lamdba"

  assume_role_policy = data.aws_iam_policy_document.lambda_exec.json
  managed_policy_arns = [
    aws_iam_policy.allow_access_to_stations.arn
  ]

  tags = local.common_tags
}
