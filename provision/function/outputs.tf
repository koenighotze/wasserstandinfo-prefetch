output "stations_bucket" {
  value = aws_s3_bucket.stations.bucket
}

output "policy_arn" {
  value = aws_iam_policy.allow_access_to_stations.arn
}

output "role_arn" {
  value = aws_iam_role.lambda.arn
}

output "lambda_arn" {
  value = aws_lambda_function.wasserstandinfo_prefetch.arn
}