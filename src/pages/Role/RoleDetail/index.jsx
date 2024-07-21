import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import ShowWithFunc from '../../../components/ShowWithFunc';
import apiConfig from '../../../configs/apiConfig';

function FunctionGroup({ func, selectedFunctionIds }) {
    function isCheck(subFuncId) {
        const idString = func.id + '/' + subFuncId;
        if (selectedFunctionIds.find((id) => id === idString)) {
            return true;
        }
        return false;
    }

    function isCheckAll() {
        const funcIds = selectedFunctionIds.filter((id) => id.split('/')[0] === func.id);
        return funcIds.length === func.subFunctions.length;
    }

    return (
        <div className='pointer-events-none flex flex-col border-b py-2'>
            <div className='inline-flex items-center'>
                <input className='!h-4 !w-4 accent-blue-600' type='checkbox' readOnly checked={isCheckAll()} />
                <label className='cursor-pointer pl-2 font-semibold text-gray-700'>{func.name}</label>
            </div>
            <div className='mt-3 flex items-center space-x-6 pl-6'>
                {func.subFunctions.map((subFunc) => (
                    <div key={subFunc.id} className='flex items-center'>
                        <input className='!h-4 !w-4 accent-blue-600' type='checkbox' readOnly checked={isCheck(subFunc.id)} />
                        <label className='pl-2 text-gray-600'>{subFunc.name}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RoleDetail() {
    const { id } = useParams();

    const [functions, setFunctions] = useState([]);
    const [selectedFunctionIds, setSelectedFunctionIds] = useState([]);

    const [role, setRole] = useState({});
    useEffect(() => {
        // Get function
        fetch(apiConfig.apiUrl + '/api/function')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setFunctions(resJson.functions);
                } else {
                    setFunctions([]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        // Get role
        fetch(apiConfig.apiUrl + '/api/role' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setRole(resJson.role);
                    setSelectedFunctionIds(resJson.role?.functions);
                } else {
                    setRole({});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className='container'>
            <div className='mx-auto max-w-[800px]'>
                <div className='mt-5 flex items-center space-x-4'>
                    <div className='flex w-[120px] flex-col'>
                        <label className='label cursor-auto'>Mã chức vụ</label>
                        <p className='text-xl font-medium'>{role?.id}</p>
                    </div>
                    <div className='flex w-[300px] flex-col'>
                        <label className='label cursor-auto'>Tên chức vụ</label>
                        <p className='text-xl font-medium'>{role?.name}</p>
                    </div>
                    <div className='flex flex-1 flex-col'>
                        <label className='label' htmlFor='description'>
                            Mô tả chức vụ
                        </label>
                        <p>{role?.description}</p>
                    </div>
                </div>

                <div className='mt-3'>
                    <p className='mb-2 font-semibold text-gray-600'>Chức năng</p>
                    <div className='!h-[400px] w-full overflow-y-scroll rounded border border-gray-300 px-5 py-5'>
                        {functions.map((func) => (
                            <FunctionGroup key={func?.id} func={func} selectedFunctionIds={selectedFunctionIds} />
                        ))}
                    </div>
                </div>

                <div className='mt-5 flex items-center justify-end'>
                    <div className='flex'>
                        <Link to={'/role'} className='btn btn-red btn-md'>
                            <span className='pr-1'>
                                <i className='fa-solid fa-circle-xmark'></i>
                            </span>
                            <span className=''>Hủy</span>
                        </Link>

                        <ShowWithFunc func='role/update'>
                            <Link to={'/role/update/' + id} className='btn btn-blue btn-md'>
                                <span className='pr-1'>
                                    <i className='fa-solid fa-circle-plus'></i>
                                </span>
                                <span className=''>Chỉnh sửa</span>
                            </Link>
                        </ShowWithFunc>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoleDetail;
