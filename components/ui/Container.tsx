import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
};

export default function Container({
    children,
    className = "",
    size = "lg",
}: ContainerProps) {
    return (
        <div className={`mx-auto px-6 ${sizeStyles[size]} ${className}`}>
            {children}
        </div>
    );
}
