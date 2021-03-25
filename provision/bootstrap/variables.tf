variable "region" {
  default = "eu-central-1"
}

variable "bucket_name_prefix" {
  default = "dschmitz"
}

locals {
  env_name = "dev" #lower(terraform.workspace)

  common_tags = {
    Owner = "dschmitz"
    Environment = local.env_name
  }

  s3_code_bucket_name = "${var.bucket_name_prefix}-wasserstandinfo-lambda-${local.env_name}-${random_integer.rand.result}"
}