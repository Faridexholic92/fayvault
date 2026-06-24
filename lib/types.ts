export type Prompt = {
  id: string
  owner_id: string
  collection_id: string | null
  title: string
  description: string | null
  body: string
  category: string | null
  tags: string[]
  variables: string[]
  visibility: "private" | "public"
  price: number
  target_model: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export type Version = {
  id: string
  prompt_id: string
  version_no: number
  body: string
  changelog: string | null
  created_at: string
}
