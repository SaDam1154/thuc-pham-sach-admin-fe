import { useState } from 'react';
import { Link, NavLink, useLocation, useMatch } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { accountSelector } from '../../../redux/selectors';

function GroupMenu({ groupMenu }) {
    const [isOpen, setIsOpen] = useState(false);
    let MainComp = 'div';
    if (!groupMenu.children) {
        MainComp = Link;
    }
    const { pathname } = useLocation();

    const pathFirst = pathname.split('/')[1];
    const mainPath = groupMenu.main.link?.split('/')[1];

    const account = useSelector(accountSelector);

    function isHiddenItem(functionName) {
        if (!account) {
            return true;
        }
        if (!functionName) {
            return false;
        }
        const findResult = account?.role?.functions?.find((_func) => _func === functionName);
        if (findResult) {
            return false;
        }
        return true;
    }

    function isHiddenParent() {
        if (!groupMenu.children) {
            return isHiddenItem(groupMenu.main?.functionName);
        } else {
            const filterResult = groupMenu.children?.filter(
                (item) => !isHiddenItem(item.functionName)
            );
            if (filterResult.length === 0) {
                return true;
            }
        }
    }

    return (
        <li
            className={clsx({
                '!hidden': isHiddenParent(),
            })}
        >
            <MainComp
                className={clsx(
                    'flex cursor-pointer select-none  items-center justify-between rounded-md px-4 py-3 text-white hover:bg-blue-400',
                    {
                        'bg-blue-400': pathFirst === mainPath,
                    }
                )}
                onClick={() => setIsOpen(!isOpen)}
                to={!groupMenu.children ? groupMenu.main?.link : undefined}
            >
                <div className="flex items-center">
                    <span className="pr-2">
                        <i className={groupMenu.main.iconClassname}></i>
                    </span>
                    <span className="select-none font-medium ">{groupMenu.main.text}</span>
                </div>
                {groupMenu.children && (
                    <span className={clsx('transition', { 'rotate-90': isOpen })}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </span>
                )}
            </MainComp>
            {groupMenu.children && isOpen && (
                <div className="space-y-2">
                    {groupMenu.children.map((item, index) => (
                        <NavLink
                            key={index}
                            className={({ isActive }) =>
                                clsx(
                                    'flex cursor-pointer items-center pl-10 pr-3 text-white hover:underline',
                                    {
                                        'font-semibold underline': isActive,
                                        '!hidden': isHiddenItem(item?.functionName),
                                    }
                                )
                            }
                            to={groupMenu.main.link + item.link}
                        >
                            <span className="pr-2">
                                <i className={item.iconClassname}></i>
                            </span>
                            <span>{item.text}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </li>
    );
}

export default GroupMenu;
