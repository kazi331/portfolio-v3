export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-primary-text">
            <div className="tech-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-secondary/10 blur-3xl" />

            {children}
        </div>
    )
}