import { useState } from 'react';

const categories = [
  { name: 'Carpenter', icon: '🪚', description: 'Woodwork & small home improvements' },
  { name: 'Cleaner', icon: '🧹', description: 'Home cleaning services' },
  { name: 'General Repair', icon: '🔧', description: 'Fix anything around the house' },
  { name: 'Gardener', icon: '🌱', description: 'Garden maintenance & landscaping' },
  { name: 'Mason', icon: '🧱', description: 'Masonry and concrete work' },
  { name: 'Electrician', icon: '⚡', description: 'Electrical repairs & installation' },
  { name: 'Plumber', icon: '🔧', description: 'Plumbing repairs & installation' },
];

const HeroSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchService, setSearchService] = useState('');
  const [location, setLocation] = useState('');

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      <div className="absolute top-20 left-8 w-16 h-16 border-4 border-cyan-400 rounded-full"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-300 to-transparent rounded-bl-full opacity-60"></div>
      <div className="absolute top-32 right-12 w-8 h-8 bg-blue-400 rounded-full opacity-60"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Content */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 leading-tight">
            Trusted workers, right at your doorstep.
          </h1>
          <p className="text-gray-600 text-lg">
            Find reliable local plumbers, electricians, carpenters, and cleaners you can trust.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-2">
            <select 
              className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 cursor-pointer"
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
            >
              <option value="">Select a service</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center flex-1 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full py-3 outline-none text-gray-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Category Icons */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                selectedCategory.name === category.name
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Category Tag */}
        <div className="flex justify-center mb-10">
          <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
            {selectedCategory.description}
          </span>
        </div>

        {/* Featured Service Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 md:w-1/2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedCategory.name}</h3>
              <p className="text-gray-600 mb-4">
                Fix doors, build shelves, install cabinets, and handle small wood repairs around your home.
              </p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  Door & cabinet repair
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  Shelves & fixtures
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  Minor renovations
                </li>
              </ul>
              <a href="#" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Find {selectedCategory.name}s Near Me
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop"
                alt="Worker"
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
