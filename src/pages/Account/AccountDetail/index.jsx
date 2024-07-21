import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import ShowWithFunc from '../../../components/ShowWithFunc';
import apiConfig from '../../../configs/apiConfig';
function AccountDetail() {
    const { id } = useParams();
    const [account, setAccount] = useState({});
    useEffect(() => {
        getAccount();
    }, []);

    function getAccount() {
        fetch(apiConfig.apiUrl + '/api/account/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setAccount(resJson.account);
                } else {
                    setAccount({});
                }
            });
    }

    return (
        <div className='container'>
            <div className='mx-auto mt-5 max-w-[500px] rounded-xl border border-slate-300 p-5'>
                <div className='space-y-3'>
                    <div className='flex flex-col'>
                        <label className='label cursor-default'>Mã tài khoản:</label>
                        <p>{account?.id}</p>
                    </div>
                    <div className='flex flex-col'>
                        <label className='label cursor-default'>Tên đăng nhập:</label>
                        <p className='font-medium text-blue-600'>{account?.username}</p>
                    </div>
                    <div className='flex flex-col'>
                        <label className='label cursor-default'>Họ tên:</label>
                        <p className='text-2xl font-medium'>{account?.name}</p>
                    </div>
                    <div className='flex flex-col'>
                        <label className='label cursor-default'>Chức vụ:</label>
                        <p className='font-medium'>{account?.role?.name}</p>
                    </div>
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/account'} className='btn btn-red btn-md'>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Hủy</span>
                    </Link>
                    <ShowWithFunc func='account/update'>
                        <Link to={'/account/update/' + id} className='btn btn-blue btn-md'>
                            <span className='pr-2'>
                                <i className='fa-solid fa-circle-plus'></i>
                            </span>
                            <span>Chỉnh sửa</span>
                        </Link>
                    </ShowWithFunc>
                </div>
            </div>
        </div>
    );
}

export default AccountDetail;
