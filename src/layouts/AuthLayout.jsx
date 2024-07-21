import { useSelector } from 'react-redux';
import { accountSelector } from '../redux/selectors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function AuthLayout({ children }) {
    const location = useLocation();
    const account = useSelector(accountSelector);
    const navigate = useNavigate();
    useEffect(() => {
        if (account === null) {
            navigate('/login');
        }
    }, [account, location.pathname]);
    return <>{children}</>;
}

export default AuthLayout;
