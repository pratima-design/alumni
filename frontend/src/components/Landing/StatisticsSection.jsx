export default function StatisticsSection() {
  const stats = [
    {
      number: "200+",
      label: "Business Partners"
    },
    {
      number: "30K+",
      label: "Satisfied Customers"
    },
    {
      number: "10+",
      label: "Years of Excellence"
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Customer-Driven Solutions with AlumniConnect
          </h2>
          <p className="text-slate-600">
            Join thousands of alumni and professionals who trust us for networking and career growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-3">
              <div className="text-4xl font-bold text-teal-600">{stat.number}</div>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
