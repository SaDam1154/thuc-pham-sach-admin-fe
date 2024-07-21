import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import { getFilterValue, setFilterValueHandler } from '../../../utils/filterValueHelpper';
import ShowWithFunc from '../../../components/ShowWithFunc';
import apiConfig from '../../../configs/apiConfig';

export default function TopBar({ filters, setFilters }) {
    const [roles, setRoles] = useState([]);
    const selectedRoles = getFilterValue('role', filters);

    useEffect(() => {
        getRoles();
    }, []);

    function getRoles() {
        fetch(apiConfig.apiUrl + '/api/role')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setRoles(resJson.roles);
                } else {
                    setRoles([]);
                }
            });
    }
    return (
        <div className='space-y-1'>
            <div className='flex items-center justify-between space-x-4'>
                <input
                    className='text-input flex-1'
                    placeholder='Tìm theo tên đăng nhập'
                    value={getFilterValue('username', filters) || ''}
                    onChange={(e) => setFilters(setFilterValueHandler('username', e.target.value))}
                />
                <input
                    className='text-input flex-1'
                    placeholder='Tìm theo họ tên'
                    value={getFilterValue('name', filters) || ''}
                    onChange={(e) => setFilters(setFilterValueHandler('name', e.target.value))}
                />

                <Listbox
                    value={selectedRoles}
                    onChange={(roleName) => setFilters(setFilterValueHandler('role', roleName))}
                    as='div'
                    className='relative flex-1'
                    multiple
                >
                    <Listbox.Button as='div' className='text-input flex cursor-pointer items-center justify-between text-gray-700'>
                        <div className='flex-1'>
                            {selectedRoles.length > 0 ? (
                                <div className='text-sm font-medium'>
                                    <LinesEllipsis
                                        maxLine='1'
                                        ellipsis='...'
                                        trimRight
                                        basedOn='letters'
                                        text={`(${selectedRoles.length}) ` + selectedRoles.join(', ')}
                                    />
                                </div>
                            ) : (
                                <div className='text-gray-500'>-- Chọn chức vụ --</div>
                            )}
                        </div>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='h-5 w-5'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                        </svg>
                    </Listbox.Button>
                    <Listbox.Options
                        as='div'
                        className='absolute top-full left-0 right-0 z-10 overflow-hidden rounded border bg-white py-2 shadow outline-none'
                    >
                        {roles.map((role) => (
                            <Listbox.Option as='div' className='cursor-pointer p-2 hover:bg-blue-100' key={role.id} value={role.name}>
                                {({ active, selected }) => (
                                    <div className='flex items-center'>
                                        <div className='mr-1 w-6'>
                                            {selected && (
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    viewBox='0 0 20 20'
                                                    fill='currentColor'
                                                    className='h-5 w-5'
                                                >
                                                    <path
                                                        fillRule='evenodd'
                                                        d='M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z'
                                                        clipRule='evenodd'
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div className='flex-1'>{role.name}</div>
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                        <div className='flex justify-center border-t pt-2'>
                            <button
                                className='px-2 text-sm font-medium text-blue-600'
                                onClick={() => setFilters(setFilterValueHandler('role', []))}
                            >
                                Xoá hết
                            </button>
                        </div>
                    </Listbox.Options>
                </Listbox>

                <ShowWithFunc func='account/add'>
                    <Link to='/account/add' className='btn btn-md btn-blue'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                        </svg>
                        <span className='ml-2'>Thêm tài khoản</span>
                    </Link>
                </ShowWithFunc>
            </div>
        </div>
    );
}
