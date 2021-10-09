export interface StrapiResponse {
    jwt: string
    user: User
}
export interface User {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    role: Role
    created_at: string
    updated_at: string
}
export interface Role {
    id: number
    name: string
    description: string
    type: string
}
