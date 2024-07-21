import { Fragment, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import TypeProduct from '../../../components/TypeProduct';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { accountSelector } from '../../../redux/selectors';
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Pagination from '../../../components/Table/Pagination';
import Table from '../../../components/Table';
import range from '../../../utils/range';
import useModal from '../../../hooks/useModal';
import DeleteDialog from '../../../components/DeleteDialog';
import ShowWithFunc from '../../../components/ShowWithFunc';
import PriceFormat from '../../../components/PriceFormat';
import apiConfig from '../../../configs/apiConfig';
function ProductDetail() {
    // const account = useSelector(accountSelector);
    // function isHiddenItem(functionName) {
    //     if (!account) {
    //         return true;
    //     }
    //     if (!functionName) {
    //         return false;
    //     }
    //     const findResult = account?.functions?.find((_func) => _func?.name === functionName);
    //     if (findResult) {
    //         return false;
    //     }
    //     return true;
    // }
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProduct();
    }, []);

    const [product, setProduct] = useState({});
    function getProduct() {
        fetch(apiConfig.apiUrl + '/api/product' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    const _product = resJson.product;
                    setProduct(_product);
                } else {
                    setProduct({});
                }
            });
    }

    return (
        <div className='container max-w-[1000px]'>
            <div className='flex space-x-8'>
                <div className='flex-1 space-y-4'>
                    <div className='flex items-baseline space-x-3'>
                        <p className='text-gray-600'>Mã sản phẩm:</p>
                        <p className='text-lg font-bold text-blue-600'>{product.id}</p>
                    </div>
                    <div>
                        <p className='text-gray-600'>Tên sản phẩm:</p>
                        <p className='text-2xl font-semibold text-blue-600'>{product.name}</p>
                    </div>
                    <div>
                        <p className='text-gray-600'>Loại sản phẩm:</p>
                        <p className='text-lg font-semibold text-gray-900'>{product.type?.name}</p>
                    </div>

                    {product?.images?.length > 0 && (
                        <div>
                            <p className='text-gray-600'>Ảnh:</p>
                            <div className='flex flex-wrap'>
                                {product.images?.map((image, index) => (
                                    <div className='p-1' key={index}>
                                        <img src={image} className='h-[120px] w-[120px] rounded object-cover' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className='text-gray-600'>Mô tả sản phẩm:</p>
                        <p className='text-gray-900'>{product.description}</p>
                    </div>
                </div>
                <div className='w-[500px] space-y-8'>
                    <div className='flex space-x-8'>
                        <div>
                            <p className='text-gray-600'>Trạng thái:</p>
                            <p
                                className={clsx('text-xl font-semibold', {
                                    'text-green-600': product.status === 'active',
                                    'text-red-600': product.status === 'inactive',
                                })}
                            >
                                {product.status === 'active' ? 'Đang bán' : 'Không bán'}
                            </p>
                        </div>
                        <div>
                            <p className='text-gray-600'>Giảm giá:</p>
                            <p
                                className={clsx('text-xl font-semibold', {
                                    'text-green-600': product.status === 'active',
                                    'text-red-600': product?.discount?.type === 'none',
                                })}
                            >
                                {product?.discount?.type === 'percent'
                                    ? 'Giảm giá theo phần trăm'
                                    : product?.discount?.type === 'amount'
                                    ? 'Không bán'
                                    : 'Không giảm giá'}
                            </p>
                        </div>
                    </div>
                    <div className='flex space-x-8'>
                        <div>
                            <p className='mr-20 text-gray-600'>Giá nhập:</p>
                            <p className='text-2xl font-semibold text-blue-600'>
                                <PriceFormat>{product.importPrice}</PriceFormat> VNĐ
                            </p>
                        </div>
                        <div>
                            <p className='text-gray-600'>Giá bán:</p>
                            <p
                                className={clsx('text-2xl font-semibold text-green-700', {
                                    'text-slate-500 line-through':
                                        product?.discount?.type === 'amount' || product?.discount?.type === 'percent',
                                })}
                            >
                                <PriceFormat>{product.price}</PriceFormat> VNĐ
                            </p>
                        </div>
                    </div>
                    {product?.discount?.type == 'amount' ||
                        (product?.discount?.type == 'percent' && (
                            <div className='flex space-x-8'>
                                <div>
                                    <p className='mr-20 text-gray-600'>Giảm giá:</p>
                                    <p className='text-2xl font-semibold text-blue-600'>
                                        <PriceFormat>{product?.discount?.value}</PriceFormat>
                                        {product?.discount?.type === 'percent' ? '%' : 'VNĐ'}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-gray-600'>Giá bán sau khi giảm:</p>
                                    <p className='text-2xl font-semibold text-green-700'>
                                        <PriceFormat>{product?.priceDiscounted}</PriceFormat> VNĐ
                                    </p>
                                </div>
                            </div>
                        ))}

                    <div className='flex space-x-8'>
                        <div>
                            <p className='text-gray-600'>Số lượng trong kho:</p>
                            <p className='text-2xl font-semibold text-blue-600'>{product.quantity}</p>
                        </div>
                        <div>
                            <p className='text-gray-600'>Số lượng đã bán:</p>
                            <p className='text-2xl font-semibold text-green-700'>{product.saledQuantity}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-end space-x-3'>
                <Link to='/product' className='btn btn-blue btn-md'>
                    <span className='pr-2'>
                        <i className='fa-solid fa-circle-plus'></i>
                    </span>
                    <span>Quay lại</span>
                </Link>
                <ShowWithFunc func='product/update'>
                    <Link to={'/product/update/' + id} className='btn btn-yellow btn-md'>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-plus'></i>
                        </span>
                        <span>Chỉnh sửa</span>
                    </Link>
                </ShowWithFunc>
            </div>
        </div>
    );
}

export default ProductDetail;
