export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Rect extends Point, Size {}

export const distance = (a: Point, b: Point): number =>
  Math.hypot(a.x - b.x, a.y - b.y)

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t

export const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
})

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))
