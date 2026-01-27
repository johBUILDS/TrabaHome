import { 
  Navbar, 
  HeroSection, 
  AboutSection, 
  HowItWorksSection, 
  Footer 
} from './components';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default App;
