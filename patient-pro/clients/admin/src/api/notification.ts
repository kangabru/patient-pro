import { useState } from "react"

export interface Notification {
  id: string
  title: string
  details: string
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "note_e5c0183b",
    title: "New Appointment",
    details: "Jack Rider has booked a new appointment for next week.",
  },
  {
    id: "note_18123a3b",
    title: "New Document",
    details: "A new X-Ray was added to Documents.",
  },
  {
    id: "note_337f6548",
    title: "Cancelled Appointment",
    details:
      "Silveen Rivers has cancelled their appointment for Friday next week.",
  },
]

export default function useNotifications(): [
  Notification[],
  (n: Notification) => void,
  () => void,
] {
  const [notifications, setNotifications] =
    useState<Notification[]>(DEMO_NOTIFICATIONS)
  const remove = (n: Notification) =>
    setNotifications((ns) => ns.filter((_n) => _n.id !== n.id))
  const clear = () => setNotifications([])
  return [notifications, remove, clear]
}
