import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import 'react-toastify/dist/ReactToastify.css';
import ShowWithFunc from '../../../components/ShowWithFunc';
import moment from 'moment';
import apiConfig from '../../../configs/apiConfig';

function VoucherDetail() {
    const { id } = useParams();
    const [voucher, setvoucher] = useState({});
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getvoucher();
        getProducts();
    }, []);

    function getvoucher() {
        fetch(apiConfig.apiUrl + '/api/voucher/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setvoucher(resJson.voucher);
                } else {
                    setvoucher({});
                }
            });
    }
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

    function mapIdToProduct(ids) {
        return ids?.map((id) => products.find((product) => product.id === id));
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
                                Mô tả
                            </label>
                            <p>{voucher?.description}</p>
                        </div>

                        <div className='mt-3'>
                            <label className='label !cursor-default'>Giảm trên</label>
                            <div className='flex items-center space-x-5'>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.discount?.type === 'percent'}
                                    />
                                    <label className='pointer-events-none pl-2'>Phần trăm</label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.discount?.type === 'amount'}
                                    />
                                    <label className='pointer-events-none pl-2'>Số tiền</label>
                                </div>
                            </div>
                        </div>

                        {voucher?.discount?.type === 'percent' && (
                            <div className='flex space-x-6'>
                                <div className='mt-3 flex flex-1 flex-col'>
                                    <label className='label' htmlFor='discountPercent'>
                                        Phần trăm giảm giá
                                    </label>
                                    <div className='flex items-center space-x-2'>
                                        <span className='text-lg font-medium text-gray-700'>{voucher?.discount.value} %</span>
                                    </div>
                                </div>
                                <div className='mt-3 flex flex-1 flex-col'>
                                    <label className='label' htmlFor='limit'>
                                        Tối đa
                                    </label>
                                    <div className='flex items-center space-x-2'>
                                        <span className='text-lg font-medium text-gray-700'>{voucher?.limit}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {voucher?.discount?.type === 'amount' && (
                            <div className='mt-3 flex flex-col'>
                                <label className='label' htmlFor='discountPercent'>
                                    Số tiền giảm
                                </label>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-lg font-medium text-gray-700'>{voucher?.discount.value} VNĐ</span>
                                </div>
                            </div>
                        )}

                        <div className='relative z-50 flex-1'>
                            <label className='label !mb-0 cursor-default text-sm'>Thời gian áp dụng *</label>
                            <p>{moment(voucher?.start).format('DD/MM/YYYY') + ' - ' + moment(voucher?.end).format('DD/MM/YYYY')}</p>
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
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.discountTargets === null}
                                    />
                                    <label htmlFor='discount-target-order' className='pointer-events-none pl-2'>
                                        Hoá đơn
                                    </label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.discountTargets !== null}
                                    />
                                    <label htmlFor='discount-target-order' className='pointer-events-none pl-2'>
                                        Tuỳ chọn sản phẩm
                                    </label>
                                </div>
                            </div>
                            {voucher?.discountTargets !== null && (
                                <div>
                                    {mapIdToProduct(voucher?.discountTargets)?.map((product) => (
                                        <div key={product?.id} className='flex items-center space-x-3 border-b p-2'>
                                            <img className='h-10 w-10 rounded' src={product?.images?.[0]} />
                                            <p className='flex-1'>{product?.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CONDITION TARGET */}
                        <div>
                            <label className='label'>Đối tượng điều kiện</label>
                            <div className='flex items-center space-x-5'>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.orderCondition?.targets === null}
                                    />
                                    <label htmlFor='discount-target-order' className='pointer-events-none pl-2'>
                                        Hoá đơn
                                    </label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.orderCondition?.targets !== null}
                                    />
                                    <label htmlFor='discount-target-order' className='pointer-events-none pl-2'>
                                        Tuỳ chọn sản phẩm
                                    </label>
                                </div>
                            </div>
                            {voucher?.orderCondition?.targets !== null && (
                                <div>
                                    {mapIdToProduct(voucher?.orderCondition?.targets)?.map((product) => (
                                        <div key={product?.id} className='flex items-center space-x-3 border-b p-2'>
                                            <img className='h-10 w-10 rounded' src={product?.images?.[0]} />
                                            <p className='flex-1'>{product?.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CONDITION */}

                        <div className='mt-3'>
                            <label className='label !cursor-default'>Điều kiện theo</label>
                            <div className='flex items-center space-x-5'>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.orderCondition?.condition?.type === 'amount'}
                                    />
                                    <label className='pointer-events-none cursor-pointer pl-2'>Số tiền</label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        className='pointer-events-none h-5 w-5 accent-blue-600'
                                        type='radio'
                                        checked={voucher?.orderCondition?.condition?.type === 'quantity'}
                                    />
                                    <label className='pointer-events-none cursor-pointer pl-2'>Số lượng</label>
                                </div>
                            </div>
                        </div>

                        {voucher?.orderCondition?.condition?.type === 'amount' && (
                            <div className='mt-3 flex flex-col'>
                                <label className='label' htmlFor='conditionAmount'>
                                    Từ số tiền
                                </label>
                                <p>{voucher?.orderCondition?.condition.value + ' VND'}</p>
                            </div>
                        )}

                        {voucher?.orderCondition?.condition?.type === 'quantity' && (
                            <div className='mt-3 flex flex-col'>
                                <label className='label' htmlFor='conditionQuantity'>
                                    Từ số lượng sản phẩm
                                </label>
                                <p>{voucher?.orderCondition?.condition.value + ' Sản phẩm'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/voucher'} className='btn btn-red btn-md'>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Quay lại</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default VoucherDetail;
