import { z } from 'zod'

//const cronPattern = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2[0-3])) (\*|([0-2]?\d|3[01])) (\*|([0-1]?\d|2[0-3]))$/

export const SceneSchema = z.object({
  'showSeconds': z.boolean().default(true),
}).default({})

export type SceneSchema = z.infer<typeof SceneSchema>
