data "terraform_remote_state" "bootstrap" {
  backend = "s3"

  config = {
    bucket = "dschmitz-terraform"
    key    = "wasserstand-info/code-bucket-state"
    region = "eu-central-1"
  }
}
