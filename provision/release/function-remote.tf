data "terraform_remote_state" "function" {
  backend = "s3"

  config = {
    bucket = "dschmitz-terraform"
    key    = "wasserstand-info/lambda-state"
    region = "eu-central-1"
  }
}
