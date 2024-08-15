import { Patient } from "@/api/patient"

const MS_DAY = 864e5 // 1000 * 60 * 60 * 24
const MS_YEAR = MS_DAY * 365 // 1000 * 60 * 60 * 24 * 365

/** Components */

export function RandLastVisit({ patient }: { patient: Patient }) {
  const maxDays = daysSinceCreated(patient)
  if (maxDays < 10) return

  const days = randDemoInt(patient.prefix_id, 10, 600)
  return toTimeString(days * 864e5)
}

export function Years(props: { date: string | undefined }): number | undefined {
  if (!props.date) return
  const diff = Math.abs(+new Date() - +new Date(props.date))
  return Math.floor(diff / MS_YEAR)
}

export function RandDemoInt(props: {
  patient: Patient
  offset: number
  max: number
  min?: number
}) {
  if (daysSinceCreated(props.patient) < 10) return 0
  return randDemoInt(
    props.patient.prefix_id,
    props.offset,
    props.max,
    props.min,
  )
}

/** Utils */

function daysSinceCreated(patient: Patient) {
  if (!patient.created_at) return 0
  const diff = Math.abs(+new Date() - +new Date(patient.created_at))
  return diff / MS_DAY
}

/**
 * Returns a random integer up to 'maxVal' using a record ID as a seed.
 * @param seedId The record ID to be used as a seed
 * @param offset Offset the seed so the same seed can output multiple values
 * @param maxVal The max value of the integer
 * @param maxVal The min value of the integer
 * @returns An integer between 2 and maxVal
 */
function randDemoInt(
  seedId: string,
  offset: number,
  maxVal: number,
  minVal = 2,
): number {
  // Convert the ID string into a number
  let seedNum = 0
  for (let i = 0; i < seedId.length; i++) seedNum += seedId.charCodeAt(i)
  // Use a high frequency sin wave as our random function
  const randFloat = Math.sin(offset * 109823 + seedNum * 182736) * 0.5 + 0.5
  return Math.floor(randFloat * (maxVal - minVal)) + minVal
}

function toTimeString(diff: number): string {
  const diffDays = Math.floor(diff / 1000 / 3600 / 24)
  const diffWeeks = Math.floor(diff / 1000 / 3600 / 24 / 7)
  const diffMonths = Math.floor(diff / 1000 / 3600 / 24 / 30)
  const diffYears = Math.floor(diff / 1000 / 3600 / 24 / 365)

  const s = (num: number): string => (num == 1 ? "" : "s")
  if (diffDays <= 2) return `Yesterday`
  if (diffDays <= 7) return `${diffDays} day${s(diffDays)} ago`
  if (diffWeeks == 1) return "Last week"
  if (diffWeeks <= 4) return `${diffWeeks} week${s(diffWeeks)} ago`
  if (diffMonths <= 12) return `${diffMonths} month${s(diffMonths)} ago`
  return `${diffYears} year${s(diffYears)} ago`
}
