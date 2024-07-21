import clsx from 'clsx';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import HeaderCell from '../../../components/Table/HeaderCell';
import { useEffect, useMemo, useState } from 'react';
import PriceFormat from '../../../components/PriceFormat';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import PriceInput from '../../../components/PriceInput';
import { orderActions } from '../../../redux/slices/orderSlice';
import LoadingForm from '../../../components/LoadingForm';
import apiConfig from '../../../configs/apiConfig';
function NameAndImageCell({ row, getValue }) {
    const image = row.getValue('image');
    return (
        <div className='flex items-center space-x-2'>
            <img src={image || '/placeholder.png'} className='h-10 w-10 rounded-full border object-cover' />
            <p className='flex-1'>{getValue()}</p>
        </div>
    );
}

const columns = [
    {
        accessorKey: 'id',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Mã
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-center'>{getValue()}</p>,
        size: 80,
    },
    {
        accessorKey: 'name',
        header: (props) => <HeaderCell tableProps={props}>Sản phẩm</HeaderCell>,
        cell: NameAndImageCell,
        size: 'full',
    },
    {
        accessorKey: 'price',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giá
            </HeaderCell>
        ),
        cell: ({ getValue }) => (
            <p className='text-right'>
                <PriceFormat>{getValue()}</PriceFormat>
            </p>
        ),
        size: 100,
    },
    {
        accessorKey: 'discount',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giảm
            </HeaderCell>
        ),
        cell: ({ getValue }) => (
            <p
                className={clsx('text-right ', {
                    'text-red-600': getValue()?.type === 'amount' || getValue()?.type === 'percent',
                })}
            >
                {getValue()?.type === 'amount' && <PriceFormat>{getValue()?.value}</PriceFormat>}
                {getValue()?.type === 'percent' && getValue()?.value + ' %'}
                {getValue()?.type != 'amount' && getValue()?.type != 'percent' && 'Không'}
            </p>
        ),
        size: 100,
    },
    {
        accessorKey: 'priceDiscounted',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giá bán
            </HeaderCell>
        ),
        cell: ({ getValue }) => (
            <p className='text-right'>
                <PriceFormat>{getValue()}</PriceFormat>
            </p>
        ),
        size: 110,
    },
    {
        accessorKey: 'orderQuantity',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                SL
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue()}</p>,
        size: 80,
    },
    {
        accessorKey: 'image',
    },
];

function PhoneGroup({ setIsValid, setValue, customers }) {
    const [customer, setCustomer] = useState(null);
    const validationSchema = Yup.object({
        phone: Yup.string()
            .required('Trường này bắt buộc')
            .matches(/^[\+|0]([0-9]{9,14})\b/, 'Số điện thoại không hợp lệ'),
    });

    const form = useFormik({
        initialValues: {
            phone: '',
        },
        validationSchema,
        onSubmit: () => {},
        validateOnChange: true,
        validateOnMount: true,
    });

    useEffect(() => {
        const _customer = customers.find((c) => c.phone === form.values.phone);
        setCustomer(_customer);
        setValue(form.values.phone, _customer);
    }, [form.values.phone]);

    useEffect(() => {
        if (form.errors?.phone) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [form.errors]);

    return (
        <div>
            <label className='label' htmlFor='phone'>
                Số điện thoại *
            </label>
            <input
                type='text'
                id='phone'
                className={clsx('text-input', {
                    invalid: form.touched.phone && form.errors.phone,
                })}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                value={form.values.phone}
                name='phone'
            />
            {customer && (
                <div className='mt-2 flex items-center space-x-2'>
                    <img src={customer.avatar || '/placeholder.png'} className='h-10 w-10 rounded-full border object-cover' />
                    <p className='flex-1'>{customer.name}</p>
                </div>
            )}
            <span
                className={clsx('text-sm text-red-500 opacity-0', {
                    'opacity-100': form.touched.phone && form.errors.phone,
                })}
            >
                {form.errors.phone || 'No message'}
            </span>
        </div>
    );
}

function DeliveryGroup({ isDelivered, setIsDelivered, setIsValid, setValue, infoValue }) {
    const validationSchema = Yup.object({
        address: Yup.string().required('Trường này bắt buộc'),
    });

    const form = useFormik({
        initialValues: {
            address: '',
        },
        validationSchema,
        onSubmit: () => {},
        validateOnChange: true,
        validateOnMount: true,
    });

    useEffect(() => {
        setValue(form.values.address);
    }, [form.values.address]);

    useEffect(() => {
        if (infoValue.customer) {
            form.setFieldValue('address', infoValue.customer.address);
        }
    }, [infoValue.customer]);

    useEffect(() => {
        if (isDelivered) {
            setIsValid(true);
        } else {
            if (form.errors.address) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        }
    }, [form.errors, isDelivered]);

    return (
        <div>
            <div className='flex items-center space-x-5'>
                <div className='flex items-center'>
                    <input
                        className='h-5 w-5 accent-blue-600'
                        type='radio'
                        id='de-1'
                        onChange={(e) => setIsDelivered(e.target.checked)}
                        checked={isDelivered}
                    />
                    <label htmlFor='de-1' className='cursor-pointer pl-2'>
                        Nhận hàng ngay
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        className='h-5 w-5 accent-blue-600'
                        type='radio'
                        id='de-2'
                        onChange={(e) => setIsDelivered(!e.target.checked)}
                        checked={!isDelivered}
                    />
                    <label htmlFor='de-2' className='cursor-pointer pl-2'>
                        Giao hàng
                    </label>
                </div>
            </div>

            {!isDelivered && (
                <div className='mt-2'>
                    <div className='flex items-center space-x-3'>
                        <label className='label' htmlFor='address'>
                            Địa chỉ giao hàng *
                        </label>
                        {infoValue?.customer && (
                            <button
                                className='font-semibold text-blue-600 hover:text-blue-700'
                                onClick={() => form.setFieldValue('address', infoValue.customer.address)}
                            >
                                Mặc định
                            </button>
                        )}
                    </div>
                    <textarea
                        type='text'
                        id='address'
                        className={clsx('text-input !h-auto py-2', {
                            invalid: form.touched.address && form.errors.address,
                        })}
                        onChange={form.handleChange}
                        value={form.values.address}
                        onBlur={form.handleBlur}
                        name='address'
                        rows={2}
                    ></textarea>
                    <span
                        className={clsx('-mt-1 block text-sm text-red-500 opacity-0', {
                            'opacity-100': form.touched.address && form.errors.address,
                        })}
                    >
                        {form.errors.address || 'No message'}
                    </span>
                </div>
            )}
        </div>
    );
}

function PaymentGroup({ isDelivered, isPaid, setIsPaid, setIsValid, totalPrice, intoMoney, setValue, priceDiscounted }) {
    const [receivedMoney, setReceivedMoney] = useState(0);
    const exchangeMoney = receivedMoney - intoMoney;

    useEffect(() => {
        setValue(receivedMoney);
        if (!isPaid) {
            setIsValid(true);
        } else if (exchangeMoney < 0) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [exchangeMoney, isPaid]);
    useEffect(() => {
        if (isDelivered) {
            setIsPaid(true);
        }
    }, [isDelivered]);
    return (
        <div className='mt-3'>
            <div className='flex items-center space-x-5'>
                <div className='flex items-center'>
                    <input
                        className='h-5 w-5 accent-blue-600'
                        type='radio'
                        id='pa-1'
                        onChange={(e) => setIsPaid(e.target.checked)}
                        checked={isPaid}
                    />
                    <label htmlFor='pa-1' className='cursor-pointer pl-2'>
                        Thanh toán ngay
                    </label>
                </div>
                <div
                    className={clsx('flex items-center', {
                        'pointer-events-none opacity-60': isDelivered,
                    })}
                >
                    <input
                        className='h-5 w-5 accent-blue-600'
                        type='radio'
                        id='pa-2'
                        onChange={(e) => setIsPaid(!e.target.checked)}
                        checked={!isPaid}
                    />
                    <label htmlFor='pa-2' className='cursor-pointer pl-2'>
                        Thanh toán sau
                    </label>
                </div>
            </div>

            {isPaid && (
                <div className='mt-4 flex space-x-6'>
                    <div className='flex flex-col content-between'>
                        <div className='flex items-center'>
                            <div className='flex w-full justify-between gap-2 font-semibold'>
                                <span>Tổng giá: </span>
                                <span
                                    className={clsx('text-xl text-green-600', {
                                        'text-green-400 line-through': priceDiscounted != 0,
                                    })}
                                >
                                    <span>
                                        <PriceFormat>{totalPrice}</PriceFormat>
                                    </span>
                                    <span> VNĐ</span>
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <p className='flex w-full justify-between gap-2 font-semibold'>
                                <span>Giảm giá: </span>
                                <span className='text-right text-xl text-red-600'>
                                    <span>
                                        <PriceFormat>{priceDiscounted}</PriceFormat>
                                    </span>
                                    <span> VNĐ</span>
                                </span>
                            </p>
                        </div>
                        <div className='flex items-center'>
                            <p className='flex w-full justify-between gap-2 font-semibold'>
                                <span>Tổng thành tiền: </span>
                                <span className='text-xl text-blue-600'>
                                    <span>
                                        <PriceFormat>{intoMoney}</PriceFormat>
                                    </span>
                                    <span> VNĐ</span>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className='border-l'></div>

                    <div className='space-y-1'>
                        <div className='flex items-center'>
                            <label className='mr-2' htmlFor='price'>
                                Tiền nhận:
                            </label>
                            <PriceInput
                                id='order-payment-received-money'
                                value={receivedMoney}
                                onChange={(e) => setReceivedMoney(e.target.value)}
                                className='w-56'
                                placeholder='Tiền nhận'
                            />
                        </div>

                        <div className=''>
                            <span>Tiền thừa: </span>
                            <span
                                className={clsx('text-xl font-semibold text-blue-600', {
                                    'text-red-600': exchangeMoney < 0,
                                })}
                            >
                                <span>
                                    <PriceFormat>{exchangeMoney}</PriceFormat>
                                </span>
                                <span> VNĐ</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoGroup({ totalPrice, intoMoney, priceDiscounted, setValue, setIsValid, customers, coupons, infoValue }) {
    const [isValidPhone, setIsValidPhone] = useState(false);
    const [isDelivered, setIsDelivered] = useState(true);
    const [isValidDelivered, setIsValidDelivered] = useState(true);
    const [isPaid, setIsPaid] = useState(true);
    const [isPaidValid, setIsPaidValid] = useState(false);

    useEffect(() => {
        setValue((prev) => ({
            ...prev,
            isDelivered,
            isPaid,
        }));
    }, [isDelivered, isPaid]);
    useEffect(() => {
        if (isValidPhone && isPaidValid && isValidDelivered) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [isValidPhone, isValidDelivered, isPaidValid]);

    return (
        <div>
            <PhoneGroup
                setIsValid={setIsValidPhone}
                setValue={(phone, customer) =>
                    setValue((prev) => ({
                        ...prev,
                        phone,
                        customer,
                    }))
                }
                customers={customers}
            />

            <DeliveryGroup
                isDelivered={isDelivered}
                setIsDelivered={setIsDelivered}
                setIsValid={setIsValidDelivered}
                setValue={(address) =>
                    setValue((prev) => ({
                        ...prev,
                        address,
                    }))
                }
                infoValue={infoValue}
            />
            <PaymentGroup
                isDelivered={isDelivered}
                isPaid={isPaid}
                setIsPaid={setIsPaid}
                setIsValid={setIsPaidValid}
                totalPrice={totalPrice}
                intoMoney={intoMoney}
                priceDiscounted={priceDiscounted}
                setValue={(receivedMoney) =>
                    setValue((prev) => ({
                        ...prev,
                        receivedMoney,
                    }))
                }
            />
        </div>
    );
}

export default function PaymentDialog({ close, meta }) {
    const selectedProducts = meta?.selectedProducts;
    const order = meta?.order;
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [coupons, setCounpons] = useState([]);
    useEffect(() => {
        fetch(apiConfig.apiUrl + '/api/customer')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCustomers(resJson.customers);
                } else {
                    setCustomers([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setCustomers([]);
            });
    }, []);

    const dispatch = useDispatch();
    const [isValidInfo, setIsValidInfo] = useState(false);
    const [infoValue, setInfoValue] = useState({
        phone: '',
        isDelivered: true,
        isPaid: true,
        receivedMoney: 0,
        customer: null,
        coupon: null,
    });

    useEffect(() => {
        if (infoValue?.customer) {
            fetch(apiConfig.apiUrl + '/api/coupon/get-by-customer/' + infoValue.customer?._id)
                .then((res) => res.json())
                .then((resJson) => {
                    if (resJson.success) {
                        setCounpons(resJson.coupons);
                    } else {
                        setCounpons([]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setCounpons([]);
                });
        }
        setInfoValue((prev) => ({
            ...prev,
            coupon: null,
        }));
    }, [infoValue?.customer]);

    const intoMoney = useMemo(() => {
        if (!infoValue?.coupon) {
            return order?.intoMoney;
        }
        if (!infoValue.coupon?.canUse) {
            return order?.intoMoney;
        }
        return order?.intoMoney - (order?.intoMoney * infoValue.coupon?.discountPercent) / 100;
    }, [infoValue?.coupon]);

    const table = useReactTable({
        data: selectedProducts,
        columns,
        state: {
            columnVisibility: { image: false },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {},
    });

    function createOrder() {
        setLoading(true);
        const details = order.details.map((d) => ({
            product: d.product._id,
            quantity: d.quantity,
            price: d.price,
            discount: d.discount,
            priceDiscounted: d.priceDiscounted,
        }));
        fetch(apiConfig.apiUrl + '/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: infoValue.customer?._id,
                deliveryStatus: infoValue.isDelivered ? 'delivered' : 'pending',
                paymentStatus: infoValue.isPaid ? 'paid' : 'unpaid',
                details: details,
                receivedMoney: infoValue.isPaid ? Number(infoValue.receivedMoney) : order.totalPrice,
                totalPrice: order.totalPrice,
                intoMoney: intoMoney,
                coupon: infoValue.coupon?._id,
                exchangeMoney: infoValue.isPaid ? Number(infoValue.receivedMoney) - intoMoney : 0,
                phone: infoValue.phone,
                address: infoValue.isDelivered ? null : infoValue.address,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    dispatch(orderActions.reset());
                    toast.success('Tạo đơn hàng thành công');
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Có lỗi xảy ra');
            })
            .finally(() => {
                close();
                setLoading(false);
            });
    }
    return (
        <div className={clsx('fixed inset-0 z-[99999] flex items-center justify-center bg-black/20 opacity-100 transition-opacity')}>
            <div className='min-h-[600px] w-full max-w-[1400px] rounded-lg bg-white p-6'>
                <div className=' text-center text-lg font-bold text-slate-900'>Thanh toán hoá đơn</div>
                <div className='mt-5 flex space-x-6'>
                    {/* PRODUCT */}
                    <div className='mt-3 flex-1'>
                        <Table table={table} notFoundMessage='Chưa có sản phẩm trong hoá đơn' rowClickable={false} />
                        <Pagination table={table} />
                    </div>

                    {/* INFOR */}
                    <div className='flex-1'>
                        {/* CUSTOMER FORM */}
                        <div className='relative'>
                            <InfoGroup
                                totalPrice={order?.totalPrice}
                                intoMoney={intoMoney}
                                priceDiscounted={order?.priceDiscounted}
                                setValue={setInfoValue}
                                setIsValid={setIsValidInfo}
                                customers={customers}
                                infoValue={infoValue}
                                coupons={coupons}
                            />
                            <LoadingForm loading={loading} />
                        </div>

                        <div className='mt-4 flex justify-between'>
                            <div className='flex justify-end'>
                                <button className='btn btn-blue btn-md' onClick={() => close()}>
                                    Quay lại
                                </button>
                                <button className='btn btn-yellow btn-md' disabled={!isValidInfo || loading} onClick={() => createOrder()}>
                                    Thanh toán hoá đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
