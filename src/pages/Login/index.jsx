import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';

import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { accountActions } from '../../redux/slices/accountSlide';
import { useState } from 'react';
import { toast } from 'react-toastify';
import apiConfig from '../../configs/apiConfig';
const validationSchema = Yup.object({
    username: Yup.string().required('Vui lòng nhập tên tài tài khoản!'),
    password: Yup.string().required('Vui lòng nhập nhập mật khẩu!'),
});

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const showSuccessNoti = () => toast.success('Đăng nhập thành công!');
    const showErorrNoti = () => toast.error('Đăng nhập không thành công!');

    const form = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
        validateOnBlur: false,
        validateOnChange: validateOnChange,
    });
    function handleFormsubmit(values) {
        setLoading(true);
        fetch(apiConfig.apiUrl + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    console.log(resJson.account);
                    showSuccessNoti();
                    dispatch(accountActions.login(resJson.account));
                    navigate('/');
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
        <div>
            <section className='bg-gray-200 '>
                <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
                    <div className=' w-[448px] rounded-lg bg-white shadow'>
                        <div className='space-y-4 p-8'>
                            <h1 className='text-center text-2xl font-semibold text-gray-900'>Đăng nhập</h1>
                            <form
                                onSubmit={(e) => {
                                    setValidateOnChange(true);
                                    form.handleSubmit(e);
                                }}
                            >
                                <div className='mb-2'>
                                    <label htmlFor='username' className='mb-1 block font-medium text-gray-900 '>
                                        Tài khoản
                                    </label>
                                    <input
                                        type='text'
                                        name='username'
                                        id='username'
                                        className={clsx('text-input w-full py-2', {
                                            invalid: form.errors.username,
                                        })}
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        value={form.values.username}
                                        placeholder='Tên tài khoản'
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': form.errors.username,
                                        })}
                                    >
                                        {form.errors.username || 'No message'}
                                    </span>
                                </div>
                                <div className='mb-2'>
                                    <label htmlFor='password' className='mb-1 block font-medium text-gray-900 '>
                                        Mật khẩu
                                    </label>
                                    <input
                                        type='password'
                                        name='password'
                                        id='password'
                                        onChange={form.handleChange}
                                        onBlur={form.handleBlur}
                                        value={form.values.password}
                                        placeholder='Mật khẩu của bạn'
                                        className={clsx('text-input w-full py-2', {
                                            invalid: form.errors.password,
                                        })}
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': form.errors.password,
                                        })}
                                    >
                                        {form.errors.password || 'No message'}
                                    </span>
                                </div>

                                <button type='submit' className='btn btn-blue btn-md mt-4 w-full' disabled={loading}>
                                    {!loading ? (
                                        <span>Đăng nhập</span>
                                    ) : (
                                        <div className='flex items-center'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth='1.5'
                                                stroke='currentColor'
                                                className='h-4 w-4 animate-spin'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
                                                />
                                            </svg>
                                            <span className='ml-1'>Đang đăng nhập</span>
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
