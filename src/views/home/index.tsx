import { HeroSection } from "@/views/home/sections/hero-section"
import { HomeContentExplorerSection } from "@/views/home/sections/home-content-explorer-section"

export function HomeView() {
  return (
    <div className="flex-col gap-8 flex">
      <HeroSection />
      <HomeContentExplorerSection />
    </div>
  )
}
