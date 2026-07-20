export default function LegalLayout({ title, updatedAt, children }: { title: string; updatedAt: string; children: React.ReactNode }) {
  return (
    <div className="container py-20">
      <div className="text-center mb-14">
        <p className="section-eyebrow">Legal</p>
        <h1 className="section-title mb-2">{title}</h1>
        <p className="text-gray-muted text-sm">Last updated: {updatedAt}</p>
      </div>
      <div className="max-w-3xl mx-auto glass-card p-10 space-y-6 text-gray-muted leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-8">
        {children}
      </div>
    </div>
  );
}
