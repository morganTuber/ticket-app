import { IFormik } from '../components'

export interface IFormField {
    label?: string
    type?: 'text' | 'number'
    id: keyof IFormik
    options?: string[]
    className?: string
}

