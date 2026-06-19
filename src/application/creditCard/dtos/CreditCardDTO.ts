export interface CreateCreditCardDTO {
  name: string
  limit: number
  used: number
  status?: string
}

export interface UpdateCreditCardDTO {
  name?: string
  limit?: number
  used?: number
  status?: string
}
