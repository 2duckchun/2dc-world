import { auth } from "@/auth"
import {
  createPresignedImageUpload,
  getImageUploadLimitBytes,
  isSupportedImageUpload,
} from "@/core/storage/s3"

type PresignRequest = {
  contentType?: unknown
  size?: unknown
}

export const POST = async (request: Request) => {
  const session = await auth()

  if (!session?.user) {
    return Response.json(
      { message: "Authentication required" },
      { status: 401 },
    )
  }

  if (session.user.role !== "admin") {
    return Response.json({ message: "Admin access required" }, { status: 403 })
  }

  let body: PresignRequest

  try {
    body = (await request.json()) as PresignRequest
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const contentType =
    typeof body.contentType === "string" ? body.contentType : ""
  const size = typeof body.size === "number" ? body.size : 0

  if (!isSupportedImageUpload(contentType, size)) {
    return Response.json(
      {
        message: "Unsupported image upload",
        maxSize: getImageUploadLimitBytes(),
      },
      { status: 400 },
    )
  }

  try {
    return Response.json(await createPresignedImageUpload({ contentType }))
  } catch {
    return Response.json(
      { message: "Image upload is not configured" },
      { status: 500 },
    )
  }
}
