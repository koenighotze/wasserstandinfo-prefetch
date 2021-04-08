#tfsec:ignore:AWS002 tfsec:ignore:AWS017
resource "aws_s3_bucket" "code" {
  bucket        = local.s3_code_bucket_name
  acl           = "private"
  force_destroy = true

  lifecycle_rule {
    id      = "cleanup"
    enabled = true

    tags = local.common_tags

    expiration {
      days = 2
    }
  }

  tags = local.common_tags
}