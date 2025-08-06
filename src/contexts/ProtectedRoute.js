import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ isLoggedIn, setShowLogin, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs when the component mounts or when isLoggedIn changes.
    if (!isLoggedIn) {
      // If the user is not logged in, trigger the login modal.
      setShowLogin(true);
      // And navigate them back to the homepage (or any public page).
      navigate('/'); 
    }
  }, [isLoggedIn, navigate, setShowLogin]);

  // If the user is logged in, render the child component (e.g., the ProductDetail page).
  // If not, render null while the useEffect redirects them.
  return isLoggedIn ? children : null;
}

export default ProtectedRoute;