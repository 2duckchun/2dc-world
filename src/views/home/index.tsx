import { HeroSection } from "@/views/home/sections/hero-section"
import { HomeContentExplorerSection } from "@/views/home/sections/home-content-explorer-section"

export function HomeView() {
  return (
    <div className="flex w-full flex-col gap-8">
      <HeroSection />
      <HomeContentExplorerSection />
    </div>
  )
}
