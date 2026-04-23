import "server-only"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

type PresignedImageUpload = {
  imageUrl: string
  key: string
  uploadUrl: string
}

const MAX_IMAGE_SIZE = 8 * 1024 * 1024
const PRESIGNED_URL_EXPIRES_IN_SECONDS = 60

const extensionByMimeType = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const

type SupportedImageType = keyof typeof extensionByMimeType

const supportedImageTypes = new Set<SupportedImageType>(
  Object.keys(extensionByMimeType) as SupportedImageType[],
)

let s3Client: S3Client | null = null

const getRequiredEnv = (key: string) => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`${key} is required for S3 image uploads`)
  }

  return value
}

const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: getRequiredEnv("AWS_REGION"),
    })
  }

  return s3Client
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "")

const getPublicImageUrl = (bucket: string, region: string, key: string) => {
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL

  if (publicBaseUrl) {
    return `${trimSlashes(publicBaseUrl)}/${key}`
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

export const isSupportedImageUpload = (contentType: string, size: number) =>
  isSupportedImageType(contentType) && size > 0 && size <= MAX_IMAGE_SIZE

export const getImageUploadLimitBytes = () => MAX_IMAGE_SIZE

const isSupportedImageType = (
  contentType: string,
): contentType is SupportedImageType =>
  supportedImageTypes.has(contentType as SupportedImageType)

export const createPresignedImageUpload = async ({
  contentType,
}: {
  contentType: string
}): Promise<PresignedImageUpload> => {
  if (!isSupportedImageType(contentType)) {
    throw new Error("Unsupported image type")
  }

  const bucket = getRequiredEnv("AWS_S3_BUCKET")
  const region = getRequiredEnv("AWS_REGION")
  const prefix = trimSlashes(process.env.AWS_S3_UPLOAD_PREFIX ?? "uploads")
  const extension = extensionByMimeType[contentType]
  const key = `${prefix}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`

  const uploadUrl = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: PRESIGNED_URL_EXPIRES_IN_SECONDS },
  )

  return {
    imageUrl: getPublicImageUrl(bucket, region, key),
    key,
    uploadUrl,
  }
}
