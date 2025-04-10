import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { JSX } from 'react';

interface Props {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
