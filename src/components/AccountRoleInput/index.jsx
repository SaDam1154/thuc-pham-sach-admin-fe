import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import apiConfig from '../../configs/apiConfig';
function AccountRoleInput({ ...props }) {
    const [accountRoles, setAccountRoles] = useState([]);
    const selectElem = useRef(null);

    useEffect(() => {
        fetch(apiConfig.apiUrl + '/api/role')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setAccountRoles(resJson.roles);
                } else {
                    setAccountRoles([]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <select {...props} ref={selectElem}>
            <option value='' disabled>
                -- Chọn chức vụ --
            </option>
            {accountRoles.map((role) => (
                <option key={role._id} value={role._id}>
                    {role.name}
                </option>
            ))}
        </select>
    );
}
export default AccountRoleInput;
