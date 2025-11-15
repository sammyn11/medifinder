import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './ui/RootLayout';
import { Home } from './views/Home';
import { Pharmacies } from './views/Pharmacies';
import { PharmacyDetail } from './views/PharmacyDetail';
import { Cart } from './views/Cart';
import { Checkout } from './views/Checkout';
import { Prescription } from './views/Prescription';
import { PharmacyDashboard } from './views/PharmacyDashboard';
import { Notifications } from './views/Notifications';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { PharmacyLogin } from './views/PharmacyLogin';
import { PharmacySignup } from './views/PharmacySignup';
import { QuickOrder } from './views/QuickOrder';
import { useAuthStore } from './store/authStore';

// Protected route component for pharmacy dashboard
function ProtectedPharmacyRoute() {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = user !== null;
  const isPharmacy = user?.role === 'pharmacy';

  if (!isAuthenticated) {
    return <Navigate to="/pharmacy/login" replace />;
  }

  if (!isPharmacy) {
    return <Navigate to="/" replace />;
  }

  return <PharmacyDashboard />;
}

// Protected route component for user authentication (ordering)
function ProtectedUserRoute({ children }: { children: React.ReactElement }) {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = user !== null;
  const location = window.location.pathname;

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location)}`} replace />;
  }

  if (user?.role === 'pharmacy') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'pharmacies', element: <Pharmacies /> },
      { path: 'pharmacies/:id', element: <PharmacyDetail /> },
      { 
        path: 'order/:pharmacyId/:medicineId', 
        element: <ProtectedUserRoute><QuickOrder /></ProtectedUserRoute>
      },
      { 
        path: 'cart', 
        element: <ProtectedUserRoute><Cart /></ProtectedUserRoute>
      },
      { 
        path: 'checkout', 
        element: <ProtectedUserRoute><Checkout /></ProtectedUserRoute>
      },
      { 
        path: 'prescription', 
        element: <ProtectedUserRoute><Prescription /></ProtectedUserRoute>
      },
      { 
        path: 'dashboard', 
        element: <ProtectedPharmacyRoute />
      },
      { path: 'notifications', element: <Notifications /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'pharmacy/login', element: <PharmacyLogin /> },
      { path: 'pharmacy/signup', element: <PharmacySignup /> }
    ]
  }
]);
