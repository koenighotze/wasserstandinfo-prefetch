resource "aws_s3_bucket" "code" {
  bucket = local.s3_code_bucket_name
  acl    = "private"

  tags = local.common_tags
}