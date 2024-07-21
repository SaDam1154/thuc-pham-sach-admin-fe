import { toast } from 'react-toastify';
import { accountSelector } from '../../../redux/selectors';
import { accountActions } from '../../../redux/slices/accountSlide';
import { useDispatch, useSelector } from 'react-redux';

function Header({ children }) {
    const dispatch = useDispatch();
    const account = useSelector(accountSelector);
    const showLogoutNoti = () => toast.info('Đã đăng xuất!');
    return (
        <header className="border-b">
            <div className="container flex h-14 items-center justify-between">
                <p className="text-xl font-bold text-slate-900">{children}</p>
                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <p className="font-bold">{account?.name}</p>
                        <p className="-mt-1 text-sm text-gray-600">{account?.role?.name}</p>
                    </div>
                    <button
                        className="btn btn-md btn-blue"
                        onClick={() => {
                            dispatch(accountActions.logout());
                            showLogoutNoti();
                        }}
                    >
                        <span className="pr-2">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
