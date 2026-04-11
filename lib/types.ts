export interface Prompt {
  id: string
  imageUrl: string
  title: string
  corePrompt: string
  negativePrompt: string
  model: string
  category: string
  aspectRatio: string
  seed?: number
  steps?: number
  cfgScale?: number
  createdBy?: string
  isAdminPost?: boolean
}

/** Row shape as stored in Supabase (snake_case) */
export interface PromptRow {
  id: string
  image_url: string
  title: string
  core_prompt: string
  negative_prompt: string
  model: string
  category: string
  aspect_ratio: string
  seed: number | null
  steps: number | null
  cfg_scale: number | null
  created_at: string
  updated_at: string
  created_by: string | null
  is_admin_post: boolean
}

export function rowToPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    imageUrl: row.image_url,
    title: row.title,
    corePrompt: row.core_prompt,
    negativePrompt: row.negative_prompt,
    model: row.model,
    category: row.category,
    aspectRatio: row.aspect_ratio,
    seed: row.seed ?? undefined,
    steps: row.steps ?? undefined,
    cfgScale: row.cfg_scale ?? undefined,
    createdBy: row.created_by ?? undefined,
    isAdminPost: row.is_admin_post,
  }
}

export const models = [
  'All Models',
  'Midjourney v6',
  'DALL-E 3',
  'Stable Diffusion XL',
  'Stable Diffusion 3',
  'Adobe Firefly',
  'Leonardo AI',
  'Ideogram',
]

export const categories = [
  'All Categories',
  'Landscape',
  'Portrait',
  'Abstract',
  'Sci-Fi',
  'Fantasy',
  'Architecture',
  'Nature',
  'Character',
  'Product',
]

export const aspectRatios = [
  'All Ratios',
  '1:1',
  '4:5',
  '16:9',
  '21:9',
  '9:16',
  '4:3',
  '3:2',
]
