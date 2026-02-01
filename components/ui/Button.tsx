import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-white shadow-lg hover:bg-primary-dark hover:shadow-xl",
    secondary:
        "bg-accent text-foreground hover:bg-accent-dark",
    outline:
        "border-2 border-border text-foreground hover:border-primary hover:text-primary",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    href,
    fullWidth = false,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`;

    if (href) {
        return (
            <a href={href} className={combinedStyles}>
                {children}
            </a>
        );
    }

    return (
        <button className={combinedStyles} {...props}>
            {children}
        </button>
    );
}
