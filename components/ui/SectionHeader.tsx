interface SectionHeaderProps {
    badge?: string;
    title: string;
    description?: string;
    centered?: boolean;
    light?: boolean;
}

export default function SectionHeader({
    badge,
    title,
    description,
    centered = true,
    light = false,
}: SectionHeaderProps) {
    return (
        <div className={`mb-16 ${centered ? "text-center" : ""}`}>
            {badge && (
                <span
                    className={`mb-4 inline-block text-sm font-medium uppercase tracking-wider ${light ? "text-white/80" : "text-primary"
                        }`}
                >
                    {badge}
                </span>
            )}
            <h2
                className={`mb-6 text-3xl font-bold md:text-4xl ${light ? "text-white" : "text-foreground"
                    }`}
            >
                <span className="font-[family-name:var(--font-playfair)]">{title}</span>
            </h2>
            {description && (
                <p
                    className={`mx-auto max-w-2xl text-lg ${light ? "text-white/80" : "text-muted"
                        }`}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
