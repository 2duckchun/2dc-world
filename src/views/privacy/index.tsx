import { readFile } from "node:fs/promises"
import path from "node:path"
import { MarkdownContent } from "@/shared/ui/markdown-content"

const PRIVACY_POLICY_FILE = "privacy/2026-05-25.md"

export async function PrivacyView() {
  const filePath = path.join(process.cwd(), PRIVACY_POLICY_FILE)
  const markdown = await readFile(filePath, "utf-8")

  return (
    <section className="grid w-full gap-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
        <MarkdownContent markdown={markdown} />
      </div>
    </section>
  )
}
