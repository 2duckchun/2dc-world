import { ExistingSeriesEditFormSections } from "./existing-series-edit-form-section"
import { NewSeriesCreateFormSection } from "./new-series-create-form-section"

export const SeriesEditAndCreateSection = () => {
  return (
    <div className="grid gap-5">
      <NewSeriesCreateFormSection />
      <ExistingSeriesEditFormSections />
    </div>
  )
}
