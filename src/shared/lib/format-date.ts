const compactDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
})

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value)
}

export function formatPublishedDate(
  value: Date | string,
  options?: { long?: boolean },
) {
  const formatter = options?.long ? longDateFormatter : compactDateFormatter
  return formatter.format(toDate(value))
}
