import { useSelector } from 'react-redux';
import { accountSelector } from '../../redux/selectors';

export default function ShowWithFunc({ func, children }) {
    const account = useSelector(accountSelector);
    function isHiddenItem(func) {
        if (!account) {
            return true;
        }
        if (!func) {
            return false;
        }
        const findResult = account?.role?.functions?.find((_func) => _func === func);
        if (findResult) {
            return false;
        }
        return true;
    }

    return !isHiddenItem(func) ? children : null;
}
