import type { InputHTMLAttributes } from 'react'

export function Checkbox({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={`ui-checkbox ${className}`.trim()} type="checkbox" {...rest} />
}
