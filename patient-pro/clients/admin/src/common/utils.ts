import type { PropsWithChildren } from "react"

type ClassProp = string | boolean | undefined | null
export function clx(...classes: ClassProp[]): string {
  return classes.filter((x) => !!x).join(" ")
}

export type Children = PropsWithChildren
export type CssClass = { className?: string }

export const sleep = (ms: number) =>
  new Promise((accept) => setTimeout(accept, ms))
