import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ children, className = '', variant = 'primary', ...rest }: ButtonProps) {
    return (
        <button className={`ui-button ui-button-${variant} ${className}`.trim()} {...rest}>
            {children}
        </button>
    )
}
