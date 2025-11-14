import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('loc', location);
    navigate(`/pharmacies?${params.toString()}`);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-pharmacy-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Find Your Medicine
                  <span className="block text-pharmacy-300">Fast & Easy</span>
                </h1>
                <p className="text-xl md:text-2xl text-primary-100 leading-relaxed">
                  Locate pharmacies in Kigali with your prescribed medicines in stock. Check insurance acceptance before you visit.
                </p>
              </div>
              
              {/* Quick Search Bar */}
              <form onSubmit={onSearch} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Search Medicine</label>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="input-field w-full text-gray-900"
                      placeholder="e.g., Amoxicillin, Paracetamol..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Location (Optional)</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-field w-full text-gray-900"
                      placeholder="e.g., Kacyiru, Remera, Nyarugenge..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full bg-white text-primary-700 hover:bg-primary-50 text-lg py-4">
                    🔍 Search Pharmacies
                  </button>
                </div>
              </form>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="btn-secondary bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white/30">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary bg-pharmacy-500 hover:bg-pharmacy-600">
                  Sign Up
                </Link>
                <Link to="/pharmacy/login" className="btn-secondary bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white/30 text-sm">
                  🏥 Pharmacy Login
                </Link>
              </div>
            </div>
            
            {/* Pharmacy Image */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-pharmacy-400 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&q=80" 
                    alt="Modern Pharmacy" 
                    className="rounded-2xl shadow-xl w-full h-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzB4YTc1ZWIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0iQXJpYWwiPk1lZGlGaW5kZXI8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MediFinder?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for finding medicines and pharmacies in Kigali
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
            <p className="text-gray-600">
              Find pharmacies with your medicine in stock. No more wasted trips across the city.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-pharmacy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pharmacy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Insurance Accepted</h3>
            <p className="text-gray-600">
              See which pharmacies accept your insurance before you visit. RSSB, Mutuelle, and more.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Home Delivery</h3>
            <p className="text-gray-600">
              Get your medicines delivered to your door. Convenient and safe, especially during busy times.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Search Medicine', desc: 'Enter the medicine name you need' },
              { step: '2', title: 'Find Pharmacies', desc: 'See which pharmacies have it in stock' },
              { step: '3', title: 'Check Insurance', desc: 'Verify insurance acceptance' },
              { step: '4', title: 'Order & Delivery', desc: 'Place order and get it delivered' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pharmacy-500 to-pharmacy-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Medicine?</h2>
          <p className="text-xl mb-8 text-pharmacy-100">
            Start searching for pharmacies in Kigali today. Save time, save money, get better.
          </p>
          <Link to="/pharmacies" className="btn-primary bg-white text-pharmacy-600 hover:bg-primary-50 text-lg inline-block">
            Browse Pharmacies
          </Link>
        </div>
      </div>
    </div>
  );
}



