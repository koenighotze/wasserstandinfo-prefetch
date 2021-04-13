variable "region" {
  default = "eu-central-1"
}

variable "function_version" {
  default = "$LATEST"
}

locals {
  env_name = "dev" #lower(terraform.workspace)

  common_tags = {
    Owner       = "dschmitz"
    Environment = local.env_name
  }  
}