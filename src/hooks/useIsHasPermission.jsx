import { useSelector } from 'react-redux';
import { accountSelector } from '../redux/selectors';

export default function useIsHasPermission() {
    const account = useSelector(accountSelector);
    return function isHiddenItem(func) {
        if (!account) {
            return false;
        }
        if (!func) {
            return true;
        }
        const findResult = account?.role?.functions?.find((_func) => _func === func);
        if (findResult) {
            return true;
        }
        return false;
    };
}
