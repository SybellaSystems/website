export default function BlogPreview() {
    const posts = [
        { title: 'Why cloud-first matters', date: '2025-01-10' },
        { title: 'Scaling systems in Africa', date: '2025-03-06' },
    ]
    return (
        <section id="blog">
            <h2 className="text-3xl font-semibold mb-6">From the blog</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {posts.map(p => (
                    <div key={p.title} className="p-6 border rounded">
                        <div className="text-xs text-gray-500">{p.date}</div>
                        <h3 className="font-semibold mt-2">{p.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">Preview text — create SEO-optimized blog section as requested in the proposal.</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
