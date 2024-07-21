import { Fragment, useState } from 'react';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import LoadingForm from '../../../components/LoadingForm';
import apiConfig from '../../../configs/apiConfig';
const validationSchema = Yup.object({
    name: Yup.string().required('Trường này bắt buộc').min(2, 'Tên phải có độ dài hơn 2 kí tự').max(30, 'Tên dài tối đa 30 kí tự'),
    address: Yup.string().required('Trường này bắt buộc'),
});

function UpdateCustomer() {
    const [loading, setLoading] = useState(false);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const [image, setImage] = useState(null);

    const showSuccessNoti = () => toast.success('Cập nhật hàng thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
    const { id } = useParams();
    const [customer, setCustomer] = useState({});
    useEffect(() => {
        callApi();
    }, []);

    function callApi() {
        fetch(apiConfig.apiUrl + '/api/customer' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCustomer(resJson.customer);
                    setImage({ file: null, url: resJson.customer.avatar });
                } else {
                    setCustomer({});
                }
            });
    }
    // const hihihaha= customer.name
    const form = useFormik({
        initialValues: {
            name: customer.name || '',
            address: customer.address || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: handleFormsubmit,
        validateOnBlur: false,
        validateOnChange: validateOnChange,
    });

    async function handleFormsubmit(values) {
        setLoading(true);
        try {
            let reqValue = {};
            Object.keys(values).forEach((key) => {
                if (values[key] !== form.initialValues[key]) {
                    reqValue[key] = values[key];
                }
            });

            let imageUrl = null;
            if (image?.file) {
                let formdata = new FormData();
                formdata.append('image', image.file);
                const res = await fetch(apiConfig.apiUrl + '/api/upload', {
                    method: 'POST',
                    body: formdata,
                });

                const data = await res.json();
                imageUrl = data.image.url;
            } else if (image?.url) {
                imageUrl = image.url;
            }

            reqValue.avatar = imageUrl;

            const res = await fetch(apiConfig.apiUrl + '/api/customer/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqValue),
            });

            const resJson = await res.json();
            if (resJson.success) {
                showSuccessNoti();
            } else {
                showErorrNoti();
            }
        } catch {
            showErorrNoti();
        } finally {
            setLoading(false);
        }
    }

    function onImageInputChange(e) {
        const url = URL.createObjectURL(e.target.files[0]);
        setImage({ file: e.target.files[0], url });
        e.target.value = null;
    }

    return (
        <div className='container'>
            <div className='mb-6 mt-2 flex items-center justify-center space-x-3 rounded bg-blue-50 py-4'>
                <span className='text-lg font-medium text-gray-700'>Mã khách hàng:</span>
                <span className='text-lg font-bold text-blue-600'>{customer.id}</span>
            </div>
            <form
                onSubmit={(e) => {
                    setValidateOnChange(true);
                    form.handleSubmit(e);
                }}
                className='mx-auto mt-5 max-w-[700px] rounded-xl border border-slate-300 p-5'
            >
                <div className='relative flex pt-10'>
                    <div className='relative h-[150px] w-[150px] rounded-full border'>
                        <img
                            className='absolute inset-0 block h-full w-full rounded-full object-cover'
                            src={image?.url || '/placeholder.png'}
                        />
                        <label
                            className='absolute inset-0 flex cursor-pointer items-center justify-center rounded-full'
                            htmlFor='image-input'
                        ></label>
                        <input id='image-input' type='file' className='hidden' onChange={onImageInputChange} />
                        {image?.url && (
                            <button
                                className='absolute top-1 right-1 rounded-full border bg-white px-2 py-2 text-red-600 hover:text-red-400'
                                onClick={() => setImage(null)}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-6 w-6'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className='ml-8 flex-1'>
                        <div className='mb-4 flex flex-col'>
                            <label className='label pointer-events-none' htmlFor='phone'>
                                Số điện thoại:
                            </label>
                            <input type='text' className={clsx('text-input w-full py-[5px]')} value={customer.phone} disabled />
                        </div>

                        <div className='flex flex-col'>
                            <label className='label' htmlFor='name'>
                                Tên khách hàng *
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
                                placeholder='Nguyễn Văn A'
                            />
                            <span
                                className={clsx('text-sm text-red-500 opacity-0', {
                                    'opacity-100': form.errors.name,
                                })}
                            >
                                {form.errors.name || 'No message'}
                            </span>
                        </div>

                        <div className='flex flex-col'>
                            <label className='label' htmlFor='address'>
                                Địa chỉ *
                            </label>
                            <textarea
                                id='address'
                                className={clsx('text-input !h-auto py-2', {
                                    invalid: form.errors.address,
                                })}
                                onChange={form.handleChange}
                                value={form.values.address}
                                name='address'
                                rows={3}
                            ></textarea>
                            <span
                                className={clsx('block text-sm text-red-500 opacity-0', {
                                    'opacity-100': form.errors.address,
                                })}
                            >
                                {form.errors.address || 'No message'}
                            </span>
                        </div>
                    </div>
                    <LoadingForm loading={loading} />
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/customer'} className='btn btn-red btn-md'>
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

export default UpdateCustomer;
