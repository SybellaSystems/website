export default function CaseStudies() {
    const cases = [
        { title: 'Digital payroll for a bank', img: '/images/case1.jpg' },
        { title: 'Cloud migration for NGO', img: '/images/case2.jpg' },
        { title: 'Ogera pilot rollout', img: '/images/case3.jpg' }
    ]
    return (
        <section id="case-studies">
            <h2 className="text-3xl font-semibold mb-6">Case Studies</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {cases.map((c) => (
                    <article key={c.title} className="rounded overflow-hidden shadow">
                        <img src={c.img} alt={c.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold">{c.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">Short summary and results — replace with content from PDF.</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
