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
    discountPercent: Yup.number().min(1, 'Giá trị phải lớn hơn 0').max(99, 'Giá trị phải nhỏ hơn 100'),
    discountAmount: Yup.number().min(1, 'Giá trị phải lớn hơn 0'),
    limit: Yup.number().min(1, 'Giá trị phải lớn hơn 0'),
});

function AddVoucher() {
    const [loading, setLoading] = useState(false);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const showSuccessNoti = () => toast.success('Tạo mã giảm giá thành công!');
    const showErorrNoti = () => toast.error('Có lỗi xảy ra!');
    const [discountTarget, setDiscountTarget] = useState('order');
    const [searchTarget, setSearchTarget] = useState('');
    const [products, setProducts] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [searchConditionTarget, setSearchConditionTarget] = useState('');
    const [conditionTarget, setConditionTarget] = useState('order');
    const [conditionProducts, setConditionProducts] = useState([]);

    const form = useFormik({
        initialValues: {
            limit: '',
            description: '',
            discountType: 'percent',
            discountPercent: '',
            discountAmount: '',
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
    console.log('discountTarget: ', discountTarget);

    function handleFormsubmit(values) {
        setLoading(true);
        const body = {
            limit: values.discountType === 'percent' ? values.limit : values.discountAmount,
            start: values.timeRange.startDate,
            end: values.timeRange.endDate,
            discount: {
                type: values.discountType,
                value: values.discountType === 'percent' ? values.discountPercent : values.discountAmount,
            },
            description: values.description,
            discountTargets: discountTarget === 'order' ? null : discountProducts.map((discountTarget) => discountTarget.id),
            orderCondition: {
                targets: conditionTarget === 'order' ? null : conditionProducts.map((conditionTarget) => conditionTarget.id),
                condition: {
                    type: values.conditionType,
                    value: values.conditionType === 'amount' ? values.conditionAmount : values.conditionQuantity,
                },
            },
        };
        console.log(body);

        fetch(apiConfig.apiUrl + '/api/voucher', {
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

    function handleClickInConditionProduct(product) {
        if (conditionProducts.findIndex((p) => p.id === product.id) !== -1) {
            setConditionProducts(conditionProducts.filter((p) => p.id !== product.id));
        } else {
            setConditionProducts([...conditionProducts, product]);
        }
    }

    function handleClickInDiscountProduct(product) {
        if (discountProducts.findIndex((p) => p.id === product.id) !== -1) {
            setDiscountProducts(discountProducts.filter((p) => p.id !== product.id));
        } else {
            setDiscountProducts([...discountProducts, product]);
        }
    }

    function productFilter(product) {
        if (searchTarget === '') {
            return product;
        } else {
            return removeVietnameseTones(product.name.toLowerCase()).includes(removeVietnameseTones(searchTarget.toLowerCase()));
        }
    }

    function productConditionFilter(product) {
        if (searchConditionTarget === '') {
            return product;
        } else {
            return removeVietnameseTones(product.name.toLowerCase()).includes(removeVietnameseTones(searchConditionTarget.toLowerCase()));
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

                        <div className='mt-3'>
                            <label className='label !cursor-default'>Giảm trên</label>
                            <div className='flex items-center space-x-5'>
                                <div className='flex items-center'>
                                    <input
                                        className='h-5 w-5 accent-blue-600'
                                        type='radio'
                                        id='discount-type-percent'
                                        name='discountType'
                                        value='percent'
                                        onChange={form.handleChange}
                                        checked={form.values.discountType === 'percent'}
                                    />
                                    <label htmlFor='discount-type-percent' className='cursor-pointer pl-2'>
                                        Phần trăm
                                    </label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='h-5 w-5 accent-blue-600'
                                        type='radio'
                                        id='discount-type-amount'
                                        name='discountType'
                                        value='amount'
                                        onChange={form.handleChange}
                                        checked={form.values.discountType === 'amount'}
                                    />
                                    <label htmlFor='discount-type-amount' className='cursor-pointer pl-2'>
                                        Số tiền
                                    </label>
                                </div>
                            </div>
                        </div>

                        {form.values.discountType === 'percent' && (
                            <div className='flex space-x-6'>
                                <div className='mt-3 flex flex-1 flex-col'>
                                    <label className='label' htmlFor='discountPercent'>
                                        Phần trăm giảm giá *
                                    </label>
                                    <div className='flex items-center space-x-2'>
                                        <input
                                            type='number'
                                            id='discountPercent'
                                            className={clsx('text-input py-[5px]', {
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
                                <div className='mt-3 flex flex-1 flex-col'>
                                    <label className='label' htmlFor='limit'>
                                        Tối đa *
                                    </label>
                                    <PriceInput
                                        id='limit'
                                        onChange={form.handleChange}
                                        value={form.values.limit}
                                        error={form.errors.limit}
                                        name='limit'
                                        placeholder=''
                                    />
                                    <span
                                        className={clsx('text-sm text-red-500 opacity-0', {
                                            'opacity-100': form.errors.limit,
                                        })}
                                    >
                                        {form.errors.limit || 'No message'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {form.values.discountType === 'amount' && (
                            <div className='mt-3 flex flex-col'>
                                <label className='label' htmlFor='discountAmount'>
                                    Số tiền giảm giá *
                                </label>
                                <PriceInput
                                    id='discountAmount'
                                    onChange={form.handleChange}
                                    value={form.values.discountAmount}
                                    error={form.errors.discountAmount}
                                    name='discountAmount'
                                    placeholder=''
                                />
                                <span
                                    className={clsx('text-sm text-red-500 opacity-0', {
                                        'opacity-100': form.errors.discountAmount,
                                    })}
                                >
                                    {form.errors.discountAmount || 'No message'}
                                </span>
                            </div>
                        )}

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
                    </div>

                    {/* RIGHT */}
                    <div className='flex-1'>
                        {/* DISCOUNT TARGET */}
                        <div>
                            <label className='label'>Đối tượng áp dụng</label>
                            <div className='flex items-center space-x-5'>
                                <div className='flex items-center'>
                                    <input
                                        className='h-5 w-5 accent-blue-600'
                                        type='radio'
                                        id='discount-target-order'
                                        name='discountTarget'
                                        onChange={(e) => e.target.checked && setDiscountTarget('order')}
                                        checked={discountTarget === 'order'}
                                    />
                                    <label htmlFor='discount-target-order' className='cursor-pointer pl-2'>
                                        Hoá đơn
                                    </label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='h-5 w-5 accent-blue-600'
                                        type='radio'
                                        id='discount-target-product'
                                        name='discountTarget'
                                        onChange={(e) => e.target.checked && setDiscountTarget('product')}
                                        checked={discountTarget === 'product'}
                                    />
                                    <label htmlFor='discount-target-product' className='cursor-pointer pl-2'>
                                        Tuỳ chọn sản phẩm
                                    </label>
                                </div>
                            </div>
                            {discountTarget === 'product' && (
                                <div>
                                    <div className='group relative z-50 mt-2'>
                                        <input
                                            type='text'
                                            className='text-input flex-1 py-1'
                                            value={searchTarget}
                                            onChange={(e) => {
                                                setSearchTarget(e.target.value);
                                            }}
                                            placeholder='Tìm kiếm sản phẩm'
                                        />

                                        <div className='absolute top-full right-0 left-0 hidden h-[300px] overflow-auto rounded border bg-white shadow group-focus-within:block'>
                                            {products.filter(productFilter).map((product) => (
                                                <button
                                                    key={product.id}
                                                    type='button'
                                                    className={clsx('flex w-full items-center space-x-3 border-b p-2', {
                                                        'bg-green-100': discountProducts.findIndex((p) => p.id === product.id) !== -1,
                                                    })}
                                                    onClick={() => handleClickInDiscountProduct(product)}
                                                >
                                                    <img className='h-10 w-10 rounded' src={product.images?.[0]} />
                                                    <p>{product.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        {discountProducts.map((product) => (
                                            <div key={product.id} className='flex items-center space-x-3 border-b p-2'>
                                                <img className='h-10 w-10 rounded' src={product.images?.[0]} />
                                                <p className='flex-1'>{product.name}</p>
                                                <div className='w-8 cursor-pointer' onClick={() => handleClickInDiscountProduct(product)}>
                                                    X
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CONDITION TARGET */}
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
                                                <div className='w-8 cursor-pointer' onClick={() => handleClickInConditionProduct(product)}>
                                                    X
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CONDITION */}

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

                        {form.values.conditionType === 'amount' && (
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

                        {form.values.conditionType === 'quantity' && (
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
                    <Link to={'/voucher'} className='btn btn-red btn-md'>
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

export default AddVoucher;
