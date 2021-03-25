terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket = "dschmitz-terraform"
    key    = "wasserstand-info/code-bucket-state"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = var.region
}