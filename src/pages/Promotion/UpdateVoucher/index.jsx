import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import AccountRoleInput from '../../../components/AccountRoleInput';
import LoadingForm from '../../../components/LoadingForm';
import apiConfig from '../../../configs/apiConfig';

const validationSchema = Yup.object({
    description: Yup.string().required('Vui lòng nhập mô tả!'),
    discountPercent: Yup.number()
        .required('Vui lòng nhập phân trăm giảm giá')
        .min(1, 'Giá trị phải lớn hơn 0')
        .max(99, 'Giá trị phải nhỏ hơn 100'),
});

function UpdateCoupon() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const showSuccessNoti = () => toast.success('Cập nhật mã giảm giá thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
    const [coupon, setCoupon] = useState({});

    useEffect(() => {
        getCoupon();
    }, []);

    function getCoupon() {
        fetch(apiConfig.apiUrl + '/api/coupon/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCoupon(resJson.coupon);
                } else {
                    setCoupon({});
                }
            });
    }

    const form = useFormik({
        initialValues: {
            description: coupon?.description || '',
            discountPercent: coupon?.discountPercent || '',
            status: coupon?.isActive ? 'active' : 'inactive',
            oneTime: !coupon?.isOneTime ? 'notOneTime' : 'oneTime',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: validateOnChange,
    });

    function handleFormsubmit(values) {
        setLoading(true);
        fetch(apiConfig.apiUrl + '/api/coupon/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                isOneTime: values.oneTime === 'oneTime',
                isActive: values.status === 'active',
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    showSuccessNoti();
                    form.resetForm();
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
                <span className='text-lg font-medium text-gray-700'>Mã giảm giá:</span>
                <span className='text-lg font-bold text-blue-600'>{coupon.name}</span>
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
                        <label className='label' htmlFor='name'>
                            Mô tả *
                        </label>
                        <textarea
                            type='text'
                            id='description'
                            className={clsx('text-input !h-auto py-2', {
                                invalid: form.errors.description,
                            })}
                            onChange={form.handleChange}
                            value={form.values.description}
                            name='description'
                            rows={2}
                        ></textarea>
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': form.errors.description,
                            })}
                        >
                            {form.errors.description || 'No message'}
                        </span>
                    </div>

                    <div className='flex flex-col'>
                        <label className='label' htmlFor='discountPercent'>
                            Phần trăm giảm giá *
                        </label>
                        <div className='flex items-center space-x-2'>
                            <input
                                type='number'
                                id='discountPercent'
                                className={clsx('text-input w-[100px] py-[5px]', {
                                    invalid: form.errors.discountPercent,
                                })}
                                onChange={form.handleChange}
                                value={form.values.discountPercent}
                                name='discountPercent'
                            />
                            <span className='text-lg font-medium text-gray-700'>%</span>
                        </div>
                        <span
                            className={clsx('text-sm text-red-500 opacity-0', {
                                'opacity-100': form.errors.discountPercent,
                            })}
                        >
                            {form.errors.discountPercent || 'No message'}
                        </span>
                    </div>

                    <div>
                        <label className='label !cursor-default'>Giới hạn</label>
                        <div className='flex items-center space-x-5'>
                            <div className='flex items-center'>
                                <input
                                    className='h-5 w-5 accent-blue-600'
                                    type='radio'
                                    id='oneTime-notOneTime'
                                    name='oneTime'
                                    value='notOneTime'
                                    onChange={form.handleChange}
                                    checked={form.values.oneTime === 'notOneTime'}
                                />
                                <label htmlFor='oneTime-notOneTime' className='cursor-pointer pl-2'>
                                    Dùng nhiều lần
                                </label>
                            </div>
                            <div className='flex items-center'>
                                <input
                                    className='h-5 w-5 accent-blue-600'
                                    type='radio'
                                    id='oneTime-oneTime'
                                    name='oneTime'
                                    value='oneTime'
                                    onChange={form.handleChange}
                                    checked={form.values.oneTime === 'oneTime'}
                                />
                                <label htmlFor='oneTime-oneTime' className='cursor-pointer pl-2'>
                                    Dùng 1 lần
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className='mt-3'>
                        <label className='label !cursor-default'>Trạng thái</label>
                        <div className='flex items-center space-x-5'>
                            <div className='flex items-center'>
                                <input
                                    className='h-5 w-5 accent-blue-600'
                                    type='radio'
                                    id='status-active'
                                    name='status'
                                    value='active'
                                    onChange={form.handleChange}
                                    checked={form.values.status === 'active'}
                                />
                                <label htmlFor='status-active' className='cursor-pointer pl-2'>
                                    Đang hoạt động
                                </label>
                            </div>
                            <div className='flex items-center'>
                                <input
                                    className='h-5 w-5 accent-blue-600'
                                    type='radio'
                                    id='status-inactive'
                                    name='status'
                                    value='inactive'
                                    onChange={form.handleChange}
                                    checked={form.values.status === 'inactive'}
                                />
                                <label htmlFor='status-inactive' className='cursor-pointer pl-2'>
                                    Không hoạt động
                                </label>
                            </div>
                        </div>
                    </div>

                    <LoadingForm loading={loading} />
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/coupon'} className='btn btn-red btn-md'>
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

export default UpdateCoupon;
