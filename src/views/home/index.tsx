import { ContentSummarySection } from "@/views/home/sections/content-summary-section"
import { HeroSection } from "@/views/home/sections/hero-section"
import { LatestUploadSection } from "@/views/home/sections/latest-upload-section"

export function HomeView() {
  return (
    <div className="flex-col gap-8 flex">
      <HeroSection />
      <LatestUploadSection />
      <ContentSummarySection />
    </div>
  )
}
