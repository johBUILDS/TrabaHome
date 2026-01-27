const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xl font-bold">Traba</span>
              <span className="text-xl font-bold text-blue-400">Home</span>
              <span className="text-blue-400">🏠</span>
            </div>
            <p className="text-blue-200 text-sm">
              Connecting homeowners with trusted local workers.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Carpenter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Electrician</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plumber</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cleaner</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200 text-sm">
          <p>&copy; 2026 TrabaHome. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
