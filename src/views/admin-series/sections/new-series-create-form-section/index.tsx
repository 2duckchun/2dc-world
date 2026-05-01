import { SeriesCreateForm } from "./series-create-form/series-create-form"

export const NewSeriesCreateFormSection = () => {
  return (
    <section className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="grid gap-1">
        <h2 className="font-bold text-xl leading-tight">새 시리즈</h2>
        <p className="text-muted-foreground text-sm">
          시리즈를 만든 뒤 글쓰기 화면에서 회차를 연결합니다.
        </p>
      </div>
      <SeriesCreateForm />
    </section>
  )
}
