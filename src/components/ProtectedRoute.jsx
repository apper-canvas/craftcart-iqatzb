import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { user } = useSelector((state) => state.auth);

  // If there's no user, redirect to the login page
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If there is a user, render the children components
  return children;
};

export default ProtectedRoute;
