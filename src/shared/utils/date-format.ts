const kstOffsetMilliseconds = 9 * 60 * 60 * 1000

export const formatKoreanDateTime = (date: Date | string) => {
  const sourceDate = typeof date === "string" ? new Date(date) : date
  const kstDate = new Date(sourceDate.getTime() + kstOffsetMilliseconds)
  const year = kstDate.getUTCFullYear()
  const month = kstDate.getUTCMonth() + 1
  const day = kstDate.getUTCDate()
  const hours = kstDate.getUTCHours()
  const minutes = kstDate.getUTCMinutes().toString().padStart(2, "0")
  const period = hours < 12 ? "오전" : "오후"
  const displayHours = hours % 12 || 12

  return `${year}. ${month}. ${day}. ${period} ${displayHours}:${minutes}`
}
