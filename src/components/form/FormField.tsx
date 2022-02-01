/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldInputProps } from 'formik'
import { FC } from 'react'

import { IFormField } from '../../typings/formField'

interface FormFieldProps {
    data: IFormField
    formikProps: FieldInputProps<any>
    touched: boolean | undefined
    error: string | undefined
}

export const FormField: FC<FormFieldProps> = ({
    data,
    formikProps,
    touched,
    error,
}): JSX.Element => {
    const { label, type } = data
    return (
        <div className={data.className ? data.className : ''}>
            <label className='capitalize label' htmlFor={data.id}>
                {label ?? data.id}
            </label>
            {/* If options is provided render a select field else render input field */}
            {data.options ? (
                <select className='input' id={data.id} {...formikProps}>
                    {data.options.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={data.id}
                    type={type ?? 'text'}
                    className={`input ${touched && error ? 'error-border' : ''}`}
                    autoComplete='off'
                    {...formikProps}
                />
            )}
            {touched && error ? (
                <p className='mt-2 text-sm text-red-400'>{error}</p>
            ) : null}
        </div>
    )
}
