import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import Datepicker from 'react-tailwindcss-datepicker';
import AccountRoleInput from '../../../components/AccountRoleInput';
import LoadingForm from '../../../components/LoadingForm';
import PriceInput from '../../../components/PriceInput';
import moment from 'moment';
import removeVietnameseTones from '../../../utils/removeVietnameseTones';
import apiConfig from '../../../configs/apiConfig';

const validationSchema = Yup.object({
    name: Yup.string().required('Vui lòng mã giảm giá!'),
    description: Yup.string().required('Vui lòng nhập mô tả!'),
});

function AddPromotion() {
    const [loading, setLoading] = useState(false);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const showSuccessNoti = () => toast.success('Tạo chương trình thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
    const [products, setProducts] = useState([]);
    const [searchConditionTarget, setSearchConditionTarget] = useState('');
    const [conditionTarget, setConditionTarget] = useState('order');
    const [conditionProducts, setConditionProducts] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [searchVoucher, setSearchVoucher] = useState('');
    const [selectVouchers, setSelectVouchers] = useState([]);

    const form = useFormik({
        initialValues: {
            description: '',
            trigger: 'buy',
            timeRange: {
                startDate: moment().format('YYYY-MM-DD'),
                endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
            },
            conditionType: 'amount',
            conditionAmount: '',
            conditionQuantity: '',
        },
        validationSchema,
        onSubmit: handleFormsubmit,
        validateOnBlur: false,
        validateOnChange: validateOnChange,
    });

    console.log(form.values);

    function handleFormsubmit(values) {
        setLoading(true);
        const body = {
            limit: values.discountType === 'percent' ? values.limit : values.discountAmount,
            start: values.timeRange.startDate,
            end: values.timeRange.endDate,
            description: values.description,
            trigger: values.trigger,
            vouchers: selectVouchers.map((v) => v.id),
            orderCondition:
                values.trigger === 'buy'
                    ? {
                          targets: conditionTarget === 'order' ? null : conditionProducts.map((conditionTarget) => conditionTarget.id),
                          condition: {
                              type: values.conditionType,
                              value: values.conditionType === 'amount' ? values.conditionAmount : values.conditionQuantity,
                          },
                      }
                    : null,
        };
        console.log(body);

        fetch(apiConfig.apiUrl + '/api/promotion-program', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    showSuccessNoti();
                    form.resetForm();
                    setValidateOnChange(false);
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

    useEffect(() => {
        getProducts();
        getVouchers();
    }, []);

    function getProducts() {
        fetch(apiConfig.apiUrl + '/api/product')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    let _product = resJson.products.sort((p1, p2) => p2.id - p1.id);
                    setProducts(_product);
                } else {
                    setProducts([]);
                }
            });
    }

    function getVouchers() {
        fetch(apiConfig.apiUrl + '/api/voucher')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setVouchers(resJson.vouchers);
                    console.log(resJson.vouchers);
                } else {
                    setVouchers([]);
                }
            });
    }

    function handleClickInConditionProduct(product) {
        if (conditionProducts.findIndex((p) => p.id === product.id) !== -1) {
            setConditionProducts(conditionProducts.filter((p) => p.id !== product.id));
        } else {
            setConditionProducts([...conditionProducts, product]);
        }
    }

    function productConditionFilter(product) {
        if (searchConditionTarget === '') {
            return product;
        } else {
            return removeVietnameseTones(product.name.toLowerCase()).includes(removeVietnameseTones(searchConditionTarget.toLowerCase()));
        }
    }

    function handleClickInVoucher(voucher) {
        if (selectVouchers.findIndex((p) => p.id === voucher.id) !== -1) {
            setSelectVouchers(selectVouchers.filter((p) => p.id !== voucher.id));
        } else {
            setSelectVouchers([...selectVouchers, voucher]);
        }
    }

    function voucherFilter(voucher) {
        if (searchVoucher === '') {
            return voucher;
        } else {
            return removeVietnameseTones(voucher.description.toLowerCase()).includes(removeVietnameseTones(searchVoucher.toLowerCase()));
        }
    }

    return (
        <div className='container'>
            <form
                onSubmit={(e) => {
                    setValidateOnChange(true);
                    form.handleSubmit(e);
                }}
                className='mx-auto mt-5 rounded-xl border border-slate-300 p-5'
            >
                <div className='relative flex space-x-8'>
                    {/* LEFT */}
                    <div className='flex-1'>
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

                        <div className='relative z-50 flex-1'>
                            <label className='label !mb-0 cursor-default text-sm'>Thời gian áp dụng *</label>
                            <Datepicker
                                value={form.values.timeRange}
                                i18n={'en'}
                                configs={{
                                    shortcuts: {
                                        today: 'Hôm nay',
                                        yesterday: 'Hôm qua',
                                        past: (period) => `${period} ngày trước`,
                                        currentMonth: 'Tháng này',
                                        pastMonth: 'Tháng trước',
                                    },
                                }}
                                inputClassName='border-2 border-slate-300 outline-none rounded w-full text-base !py-1.5 hover:border-blue-500'
                                displayFormat={'DD/MM/YYYY'}
                                separator={'đến'}
                                onChange={(newValue) => form.setFieldValue('timeRange', newValue)}
                                showShortcuts={true}
                            />
                        </div>

                        <div className='mt-3'>
                            <label className='label !cursor-default'>Phiếu giảm giá</label>
                            <div>
                                <div className='group relative mt-2'>
                                    <input
                                        type='text'
                                        className='text-input flex-1 py-1'
                                        value={searchVoucher}
                                        onChange={(e) => {
                                            setSearchVoucher(e.target.value);
                                        }}
                                        placeholder='Tìm kiếm phiếu giảm giá'
                                    />

                                    <div className='absolute top-full right-0 left-0 z-50 hidden h-[300px] overflow-auto rounded border bg-white shadow group-focus-within:block'>
                                        {vouchers.filter(voucherFilter).map((voucher) => (
                                            <button
                                                key={voucher.id}
                                                type='button'
                                                className={clsx('flex w-full items-center space-x-3 border-b p-2', {
                                                    'bg-green-100': conditionProducts.findIndex((p) => p.id === voucher.id) !== -1,
                                                })}
                                                onClick={() => handleClickInVoucher(voucher)}
                                            >
                                                <p>{voucher.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    {selectVouchers.map((voucher) => (
                                        <div key={voucher.id} className='flex items-center space-x-3 border-b p-2'>
                                            <p className='flex-1'>{voucher.description}</p>
                                            <div className='w-8 cursor-pointer' onClick={() => handleClickInVoucher(voucher)}>
                                                X
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className='flex-1'>
                        <div className='mt-3'>
                            <label className='label !cursor-default'>Thực hiện khi</label>
                            <div className='flex items-center space-x-5'>
                                <div className='flex items-center'>
                                    <input
                                        className='h-5 w-5 accent-blue-600'
                                        type='radio'
                                        id='trigger-buy'
                                        name='trigger'
                                        value='buy'
                                        onChange={form.handleChange}
                                        checked={form.values.trigger === 'buy'}
                                    />
                                    <label htmlFor='trigger-buy' className='cursor-pointer pl-2'>
                                        Mua hoá đơn
                                    </label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='h-5 w-5 accent-blue-600'
                                        type='radio'
                                        id='trigger-register'
                                        name='trigger'
                                        value='register'
                                        onChange={form.handleChange}
                                        checked={form.values.trigger === 'register'}
                                    />
                                    <label htmlFor='trigger-register' className='cursor-pointer pl-2'>
                                        Đăng ký tài khoản
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* CONDITION TARGET */}
                        {form.values.trigger === 'buy' && (
                            <div className='mt-4'>
                                <label className='label'>Đối tượng điều kiện</label>
                                <div className='flex items-center space-x-5'>
                                    <div className='flex items-center'>
                                        <input
                                            className='h-5 w-5 accent-blue-600'
                                            type='radio'
                                            id='condition-target-order'
                                            name='conditionTarget'
                                            onChange={(e) => e.target.checked && setConditionTarget('order')}
                                            checked={conditionTarget === 'order'}
                                        />
                                        <label htmlFor='condition-target-order' className='cursor-pointer pl-2'>
                                            Hoá đơn
                                        </label>
                                    </div>
                                    <div className='flex items-center'>
                                        <input
                                            className='h-5 w-5 accent-blue-600'
                                            type='radio'
                                            id='condition-target-product'
                                            name='conditionTarget'
                                            onChange={(e) => e.target.checked && setConditionTarget('product')}
                                            checked={conditionTarget === 'product'}
                                        />
                                        <label htmlFor='condition-target-product' className='cursor-pointer pl-2'>
                                            Tuỳ chọn sản phẩm
                                        </label>
                                    </div>
                                </div>
                                {conditionTarget === 'product' && (
                                    <div>
                                        <div className='group relative mt-2'>
                                            <input
                                                type='text'
                                                className='text-input flex-1 py-1'
                                                value={searchConditionTarget}
                                                onChange={(e) => {
                                                    setSearchConditionTarget(e.target.value);
                                                }}
                                                placeholder='Tìm kiếm sản phẩm'
                                            />

                                            <div className='absolute top-full right-0 left-0 z-50 hidden h-[300px] overflow-auto rounded border bg-white shadow group-focus-within:block'>
                                                {products.filter(productConditionFilter).map((product) => (
                                                    <button
                                                        key={product.id}
                                                        type='button'
                                                        className={clsx('flex w-full items-center space-x-3 border-b p-2', {
                                                            'bg-green-100': conditionProducts.findIndex((p) => p.id === product.id) !== -1,
                                                        })}
                                                        onClick={() => handleClickInConditionProduct(product)}
                                                    >
                                                        <img className='h-10 w-10 rounded' src={product.images?.[0]} />
                                                        <p>{product.name}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            {conditionProducts.map((product) => (
                                                <div key={product.id} className='flex items-center space-x-3 border-b p-2'>
                                                    <img className='h-10 w-10 rounded' src={product.images?.[0]} />
                                                    <p className='flex-1'>{product.name}</p>
                                                    <div
                                                        className='w-8 cursor-pointer'
                                                        onClick={() => handleClickInConditionProduct(product)}
                                                    >
                                                        X
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CONDITION */}

                        {form.values.trigger === 'buy' && (
                            <div className='mt-3'>
                                <label className='label !cursor-default'>Điều kiện theo</label>
                                <div className='flex items-center space-x-5'>
                                    <div className='flex items-center'>
                                        <input
                                            className='h-5 w-5 accent-blue-600'
                                            type='radio'
                                            id='condition-type-amount'
                                            name='conditionType'
                                            value='amount'
                                            onChange={form.handleChange}
                                            checked={form.values.conditionType === 'amount'}
                                        />
                                        <label htmlFor='condition-type-amount' className='cursor-pointer pl-2'>
                                            Số tiền
                                        </label>
                                    </div>
                                    <div className='flex items-center'>
                                        <input
                                            className='h-5 w-5 accent-blue-600'
                                            type='radio'
                                            id='condition-type-quantity'
                                            name='conditionType'
                                            value='quantity'
                                            onChange={form.handleChange}
                                            checked={form.values.conditionType === 'quantity'}
                                        />
                                        <label htmlFor='condition-type-quantity' className='cursor-pointer pl-2'>
                                            Số lượng
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {form.values.trigger === 'buy' && form.values.conditionType === 'amount' && (
                            <div className='mt-3 flex flex-col'>
                                <label className='label' htmlFor='conditionAmount'>
                                    Từ số tiền *
                                </label>
                                <PriceInput
                                    id='conditionAmount'
                                    onChange={form.handleChange}
                                    value={form.values.conditionAmount}
                                    error={form.errors.conditionAmount}
                                    name='conditionAmount'
                                    placeholder=''
                                />
                                <span
                                    className={clsx('text-sm text-red-500 opacity-0', {
                                        'opacity-100': form.errors.conditionAmount,
                                    })}
                                >
                                    {form.errors.conditionAmount || 'No message'}
                                </span>
                            </div>
                        )}

                        {form.values.trigger === 'buy' && form.values.conditionType === 'quantity' && (
                            <div className='mt-3 flex flex-col'>
                                <label className='label' htmlFor='conditionQuantity'>
                                    Từ số lượng sản phẩm *
                                </label>
                                <input
                                    type='number'
                                    min='1'
                                    name='conditionQuantity'
                                    value={form.values.conditionQuantity}
                                    onChange={form.handleChange}
                                    className={clsx('text-input w-32 py-1 text-right text-base')}
                                />
                                <span
                                    className={clsx('text-sm text-red-500 opacity-0', {
                                        'opacity-100': form.errors.conditionQuantity,
                                    })}
                                >
                                    {form.errors.conditionQuantity || 'No message'}
                                </span>
                            </div>
                        )}
                    </div>

                    <LoadingForm loading={loading} />
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/promotion'} className='btn btn-red btn-md'>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Hủy</span>
                    </Link>
                    <button type='button' onClick={() => handleFormsubmit(form.values)} className='btn btn-blue btn-md' disabled={loading}>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-plus'></i>
                        </span>
                        <span>Thêm</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddPromotion;
