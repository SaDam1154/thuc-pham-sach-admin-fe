import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import AccountRoleInput from '../../../components/AccountRoleInput';
import LoadingForm from '../../../components/LoadingForm';
import apiConfig from '../../../configs/apiConfig';
const validationSchema = Yup.object({
    role: Yup.string().required('Trường này bắt buộc'),
    name: Yup.string().required('Trường này bắt buộc').min(2, 'Tên phải có độ dài hơn 2 kí tự').max(30, 'Tên dài tối đa 30 kí tự'),
    email: Yup.string()
        .required('Trường này bắt buộc')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Email sai không đúng định dạng'),
    username: Yup.string().required('Vui lòng nhập tên tài tài khoản!'),
});

function UpdateAccount() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const showSuccessNoti = () => toast.success('Cập nhật tài khoản thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
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

    const form = useFormik({
        initialValues: {
            name: account?.name || '',
            email: account?.email || '',
            role: account?.role?._id || '',
            username: account?.username || '',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: validateOnChange,
    });

    function handleFormsubmit(values) {
        setLoading(true);
        fetch(apiConfig.apiUrl + '/api/account/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    showSuccessNoti();
                } else {
                    showErorrNoti();
                }
            })
            .catch(() => {
                showErorrNoti();
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className='container'>
            <div className='mb-6 mt-2 flex items-center justify-center space-x-3 rounded bg-blue-50 py-4'>
                <span className='text-lg font-medium text-gray-700'>Mã tài khoản:</span>
                <span className='text-lg font-bold text-blue-600'>{account.id}</span>
            </div>
            <form
                onSubmit={(e) => {
                    setValidateOnChange(true);
                    form.handleSubmit(e);
                }}
                className='mx-auto mt-5 max-w-[500px] rounded-xl border border-slate-300 p-5'
            >
                <div className='relative pt-10'>
                    <div className='flex flex-col'>
                        <label className='label cursor-default'>Tên đăng nhập *</label>
                        <input
                            type='text'
                            id='username'
                            className={clsx('text-input w-full py-[5px]')}
                            value={form.values.username}
                            name='username'
                            disabled
                        />
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': form.errors.username,
                            })}
                        >
                            {form.errors.username || 'No message'}
                        </span>
                    </div>
                    <div className='flex flex-col'>
                        <label className='label' htmlFor='email'>
                            Email *
                        </label>
                        <input
                            type='text'
                            id='email'
                            className={clsx('text-input w-full py-[5px]', {
                                invalid: form.errors.email,
                            })}
                            onChange={form.handleChange}
                            value={form.values.email}
                            name='email'
                        />
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': form.errors.email,
                            })}
                        >
                            {form.errors.email || 'No message'}
                        </span>
                    </div>
                    <div className='flex flex-col'>
                        <label className='label' htmlFor='name'>
                            Họ tên *
                        </label>
                        <input
                            type='text'
                            id='name'
                            className={clsx('text-input w-full py-[5px]', {
                                invalid: form.errors.name,
                            })}
                            onChange={form.handleChange}
                            value={form.values.name}
                            name='name'
                        />
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': form.errors.name,
                            })}
                        >
                            {form.errors.name || 'No message'}
                        </span>
                    </div>

                    <div>
                        <label className='label' htmlFor='type'>
                            Chức vụ *
                        </label>
                        <AccountRoleInput
                            id='role'
                            className={clsx('text-input cursor-pointer py-[5px]', {
                                invalid: form.errors.role,
                            })}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            value={form.values.role}
                            name='role'
                        />

                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': form.errors.role,
                            })}
                        >
                            {form.errors.role || 'No message'}
                        </span>
                    </div>
                    <LoadingForm loading={loading} />
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/account'} className='btn btn-red btn-md'>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Hủy</span>
                    </Link>
                    <button type='submit' className='btn btn-blue btn-md' disabled={loading}>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-plus'></i>
                        </span>
                        <span>Cập nhật</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateAccount;
