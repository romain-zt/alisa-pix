export type SceneType = 'full' | 'floating' | 'horizontal' | 'closeup'

export interface SceneConfig {
  type: SceneType
  src: string
  text?: string
  duration?: string
  direction?: 'left' | 'right'
  textPosition?: 'left' | 'right' | 'center'
  /** CSS object-position for cropping emphasis (e.g. 'center 30%') */
  focus?: string
}

export interface BreathConfig {
  type: 'breath'
  height: string
}

export type SequenceItem = SceneConfig | BreathConfig

export function isBreath(item: SequenceItem): item is BreathConfig {
  return item.type === 'breath'
}

export type Stops = readonly (readonly [number, number])[]

export function interpolate(stops: Stops, t: number) {
  if (t <= stops[0][0]) return stops[0][1]
  if (t >= stops[stops.length - 1][0]) return stops[stops.length - 1][1]
  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, y0] = stops[i]
    const [x1, y1] = stops[i + 1]
    if (t >= x0 && t <= x1) return y0 + ((t - x0) / (x1 - x0)) * (y1 - y0)
  }
  return stops[stops.length - 1][1]
}
