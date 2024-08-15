export interface User {
  first_name: string
  last_name: string
  avatar: string
  practice: {
    name: string
  }
}

const DEMO_USER: User = {
  first_name: "Will",
  last_name: "Heal",
  avatar: "/doctor-avatar.jpg",
  practice: {
    name: "Albion Hills Practice",
  },
}

export default function useUser(): User {
  return DEMO_USER
}
