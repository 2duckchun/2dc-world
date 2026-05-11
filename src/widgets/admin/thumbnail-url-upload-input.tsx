"use client"

import { ImagePlus, LoaderCircle } from "lucide-react"
import { type ChangeEvent, type ClipboardEvent, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

const imageUploadAccept = "image/avif,image/gif,image/jpeg,image/png,image/webp"
const acceptedImageTypes = imageUploadAccept.split(",")

type PresignedImageUpload = {
  imageUrl?: unknown
  uploadUrl?: unknown
}

type ThumbnailUrlUploadInputProps = {
  id: string
  invalid?: boolean
  onBlur: () => void
  onChange: (value: string | null) => void
  value: string
}

const getUploadErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "이미지 업로드에 실패했습니다."

const uploadThumbnailImage = async (image: File) => {
  const presignResponse = await fetch("/api/admin/uploads/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType: image.type,
      size: image.size,
    }),
  })

  if (!presignResponse.ok) {
    throw new Error("이미지 업로드를 준비하지 못했습니다.")
  }

  const presign = (await presignResponse.json()) as PresignedImageUpload

  if (
    typeof presign.imageUrl !== "string" ||
    typeof presign.uploadUrl !== "string"
  ) {
    throw new Error("이미지 업로드 응답이 올바르지 않습니다.")
  }

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  })

  if (!uploadResponse.ok) {
    throw new Error("이미지를 업로드하지 못했습니다.")
  }

  return presign.imageUrl
}

export function ThumbnailUrlUploadInput({
  id,
  invalid = false,
  onBlur,
  onChange,
  value,
}: ThumbnailUrlUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputId = `${id}-image-upload`

  const handleImageUpload = async (image: File) => {
    setIsUploading(true)

    try {
      const imageUrl = await uploadThumbnailImage(image)
      onChange(imageUrl)
      onBlur()
      toast.success("썸네일 이미지를 업로드했습니다.")
    } catch (error) {
      toast.error(getUploadErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const image = input.files?.[0]

    if (!image) {
      return
    }

    try {
      await handleImageUpload(image)
    } finally {
      input.value = ""
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (isUploading) {
      return
    }

    const imageItem = Array.from(event.clipboardData.items).find(
      (item) => item.kind === "file" && acceptedImageTypes.includes(item.type),
    )

    if (!imageItem) {
      return
    }

    const file = imageItem.getAsFile()

    if (!file) {
      return
    }

    event.preventDefault()
    void handleImageUpload(file)
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
      <Input
        id={id}
        type="url"
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value || null)}
        onPaste={handlePaste}
        aria-invalid={invalid}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        aria-controls={fileInputId}
        aria-busy={isUploading}
        className="sm:min-w-[7.5rem]"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <LoaderCircle
            data-icon="inline-start"
            className="size-4 animate-spin"
          />
        ) : (
          <ImagePlus data-icon="inline-start" className="size-4" />
        )}
        {isUploading ? "업로드 중" : "이미지 업로드"}
      </Button>
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept={imageUploadAccept}
        className="sr-only"
        tabIndex={-1}
        onChange={handleFileChange}
      />
    </div>
  )
}
