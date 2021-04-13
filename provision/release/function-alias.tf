resource "aws_lambda_alias" "alias" {
  name             = local.env_name
  description      = "Alias for Wasserstandinfo prefetch on ${local.env_name}"
  function_name    = data.terraform_remote_state.function.outputs.lambda_arn
  function_version = var.function_version
}