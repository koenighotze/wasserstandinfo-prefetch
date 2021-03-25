variable "region" {
  default = "eu-central-1"
}

variable "bucket_name_prefix" {
  default = "dschmitz"
}

variable "app_version" {
  default = "0.0.1"
}

locals {
  env_name = "dev" #lower(terraform.workspace)

  common_tags = {
    Owner = "dschmitz"
    Environment = local.env_name
  }

  s3_stations_bucket_name = "${var.bucket_name_prefix}-wasserstandinfo-stations-${local.env_name}-${random_integer.rand.result}"
}