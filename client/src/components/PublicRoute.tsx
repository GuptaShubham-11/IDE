import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { ReactNode } from 'react';
import Spinner from './Spinner';

interface Props {
  children: ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated, authLoading } = useAppSelector(
    (state) => state.auth
  );

  if (authLoading) return <Spinner />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
