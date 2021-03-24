terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket = "dschmitz-terraform"
    key    = "wasserstand-info/lambda-state"
    region = "eu-central-1"
  }
}

provider "aws" {
   region = var.region
}