#tfsec:ignore:AWS002 
#tfsec:ignore:AWS017
resource "aws_s3_bucket" "stations" {
  bucket        = local.s3_stations_bucket_name
  acl           = "private"
  force_destroy = true

  tags = local.common_tags
}