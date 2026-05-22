export default function ServicesSection() {
  const services = [
    {
      title: "Networking Hub",
      description: "Connect with fellow alumni, students, and professionals in your industry",
      icon: "🤝",
      bgIcon: "⊕"
    },
    {
      title: "Job Board",
      description: "Discover internship and job opportunities from top companies",
      icon: "⚡",
      bgIcon: "⚡"
    },
    {
      title: "Event Management",
      description: "Participate in workshops, seminars, and networking events",
      icon: "📊",
      bgIcon: "📊"
    },
    {
      title: "Secure Connections",
      description: "Your data is protected with enterprise-grade security",
      icon: "🔒",
      bgIcon: "🔒"
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Smart Automation, Limitless Possibilities
          </h2>
          <p className="text-xl text-slate-600">
            With AlumniConnect, you get a powerful platform designed to optimize your networking and scale your professional growth effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg hover:border-teal-300 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 text-xl">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
