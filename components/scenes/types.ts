export type SceneType = 'full' | 'floating' | 'horizontal' | 'closeup'

export interface SceneConfig {
  type: SceneType
  src: string
  text?: string
  duration?: string
  direction?: 'left' | 'right'
  textPosition?: 'left' | 'right' | 'center'
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
