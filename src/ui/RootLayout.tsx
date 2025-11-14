import { Link, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const isAuthenticated = user !== null;
  
  // Don't show header/footer on full-page views
  const isFullPage = ['/dashboard', '/notifications'].includes(location.pathname);

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (isFullPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">💊</span>
              <span className="font-bold text-xl text-primary-600">MediFinder</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLink 
                to="/pharmacies" 
                className={({ isActive }) => 
                  `font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                }
              >
                Search
              </NavLink>
              <NavLink 
                to="/prescription" 
                className={({ isActive }) => 
                  `font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                }
              >
                Prescription
              </NavLink>
              {isAuthenticated && user?.role === 'pharmacy' && (
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                  }
                >
                  Dashboard
                </NavLink>
              )}
              {!isAuthenticated && (
                <Link 
                  to="/pharmacy/login" 
                  className="font-medium transition-colors text-gray-700 hover:text-primary-600"
                >
                  Pharmacy Login
                </Link>
              )}
              <NavLink 
                to="/notifications" 
                className={({ isActive }) => 
                  `font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                }
              >
                Notifications
              </NavLink>
              <NavLink 
                to="/cart" 
                className={({ isActive }) => 
                  `font-medium transition-colors relative ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                }
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pharmacy-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </nav>
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="hidden md:block text-sm text-gray-700">
                    <span className="font-medium">Hello, {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">MediFinder</h3>
              <p className="text-sm text-gray-600">
                Your trusted partner for finding medicines and pharmacies in Kigali, Rwanda.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/pharmacies" className="hover:text-primary-600">Search Pharmacies</Link></li>
                <li><Link to="/prescription" className="hover:text-primary-600">Upload Prescription</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-600">Pharmacy Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/notifications" className="hover:text-primary-600">Order Status</Link></li>
                <li><a href="#" className="hover:text-primary-600">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-600">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MediFinder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}



