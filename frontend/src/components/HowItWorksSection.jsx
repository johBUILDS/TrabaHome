const steps = [
  {
    number: 1,
    title: 'Search',
    description: 'Choose a service and your location',
    color: 'bg-blue-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Choose',
    description: 'Browse nearby workers with ratings',
    color: 'bg-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Hire and Review',
    description: "A worker accepts your request and fixes the problem. Share feedback if you'd like.",
    color: 'bg-green-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-amber-600">
          <circle cx="150" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="150" cy="150" r="60" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="70" y1="150" x2="230" y2="150" stroke="currentColor" strokeWidth="2" />
          <line x1="150" y1="70" x2="150" y2="230" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          {/* Phone Image */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-72 h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">TrabaHome</h3>
                  <p className="text-gray-600 text-sm">Find trusted workers near you</p>
                  <div className="mt-6 bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Job Request Sent
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Steps */}
          <div className="lg:w-1/2">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 ${step.color} bg-opacity-20 rounded-full flex items-center justify-center`}>
                        <div className={`${step.color.replace('bg-', 'text-')}`}>
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 ml-13">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg hover:shadow-xl">
                Find Workers Near Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
