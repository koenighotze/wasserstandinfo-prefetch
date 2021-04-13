resource "aws_lambda_alias" "alias" {
  name             = "wasserstandinfo-prefetch-${local.env_name}-alias"
  description      = "Alias for Wasserstandinfo prefetch"
  function_name    = data.terraform_remote_state.function.outputs.lambda_arn
  function_version = var.function_version
}