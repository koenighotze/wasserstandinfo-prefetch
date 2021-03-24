resource "aws_s3_bucket" "stations" {
  bucket = local.s3_stations_bucket_name
  acl    = "private"

  tags = local.common_tags
}