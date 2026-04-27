type LatestUploadHeaderProps = {
  eyebrow: string
  title: string
  titleId: string
}

export function LatestUploadHeader({
  eyebrow,
  title,
  titleId,
}: LatestUploadHeaderProps) {
  return (
    <div className="border-border border-b p-5 sm:p-7">
      <div className="grid gap-2">
        <p className="font-mono text-muted-foreground text-sm">{eyebrow}</p>
        <h2 id={titleId} className="text-balance font-black text-3xl">
          {title}
        </h2>
      </div>
    </div>
  )
}
