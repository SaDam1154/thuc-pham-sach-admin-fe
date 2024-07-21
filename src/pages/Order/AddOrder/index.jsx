import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { Listbox, Popover } from '@headlessui/react';
import clsx from 'clsx';
import TimeNow from '../../../components/TimeNow';
import PriceFormat from '../../../components/PriceFormat';
import { useDispatch, useSelector } from 'react-redux';
import { orderSelector } from '../../../redux/selectors';
import { orderActions } from '../../../redux/slices/orderSlice';
import { useMemo } from 'react';
import PriceInput from '../../../components/PriceInput';
import { toast, ToastContainer } from 'react-toastify';
import ProductCard from '../../../components/ProductCard';
import { Scrollbars } from 'react-custom-scrollbars';
import removeVietnameseTones from '../../../utils/removeVietnameseTones';
import useModal from '../../../hooks/useModal';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import HeaderCell from '../../../components/Table/HeaderCell';
import PaymentDialog from './PaymentDialog';
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

function ActionCell({ table, row }) {
    const _id = row.getValue('_id');
    return (
        <div className='flex justify-end'>
            <button className='text-red-500 hover:text-red-400' onClick={() => table.options.meta?.onDeleteProduct(_id)}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                    />
                </svg>
            </button>
        </div>
    );
}

function QuantityCell({ getValue, table, row }) {
    const quantity = getValue();
    const _id = row.getValue('_id');
    return (
        <div className='flex justify-end'>
            <input
                type='number'
                min='1'
                value={quantity || ''}
                onChange={(e) => table.options.meta?.onUpdateQuantityProduct(_id, e.target.value)}
                className={clsx('text-input w-14 py-1 text-right text-base')}
            />
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
        header: (props) => <HeaderCell tableProps={props}>Tên</HeaderCell>,
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
        cell: QuantityCell,
        size: 80,
    },
    {
        id: 'action',
        header: '',
        cell: ActionCell,
        size: 50,
    },
    {
        accessorKey: 'image',
    },
    {
        accessorKey: '_id',
    },
];

function AddOrder() {
    const order = useSelector(orderSelector);
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [idFilter, setIdFilter] = useState('');

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [renderProduct, setRenderProduct] = useState([]);

    const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState(false);

    useEffect(() => {
        fetch(apiConfig.apiUrl + '/api/product')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProducts(resJson.products);
                    setRenderProduct(resJson.products);
                } else {
                    setProducts([]);
                    setRenderProduct([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setProducts([]);
                setRenderProduct([]);
            });
    }, []);

    // Render product list
    useEffect(() => {
        setRenderProduct(
            products
                .filter((product) => {
                    if (search === '') {
                        return product;
                    } else {
                        if (removeVietnameseTones(product.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase()))) {
                            var id = product.id.toString();
                            return product.id.toString().includes(id);
                        }
                    }
                })
                .filter((product) => {
                    if (!idFilter) {
                        return true;
                    }
                    return product.id == idFilter;
                })
        );
    }, [search, idFilter]);

    useEffect(() => {
        setSelectedProducts(
            order.details.map((detail) => {
                const matchedProduct = products.find((product) => product._id === detail.product._id);
                if (!matchedProduct) {
                    return {};
                }
                return {
                    _id: detail.product._id,
                    id: matchedProduct.id,
                    image: matchedProduct.images?.[0] || '/placeholder.png',
                    name: matchedProduct.name,
                    price: matchedProduct.price,
                    discount: matchedProduct.discount,
                    priceDiscounted: matchedProduct.priceDiscounted,
                    orderQuantity: detail.quantity,
                };
            })
        );
        console.log(order);
    }, [order, products]);

    const table = useReactTable({
        data: selectedProducts,
        columns,
        state: {
            columnVisibility: { image: false, _id: false },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            onUpdateQuantityProduct: (_id, quantity) => dispatch(orderActions.updateQuantity({ _id, quantity })),
            onDeleteProduct: (_id) => dispatch(orderActions.remove(_id)),
        },
    });

    return (
        <>
            <div className='container h-full w-full overflow-y-hidden py-2'>
                <div className='flex h-full'>
                    {/* LEFT VIEW */}
                    <div className='flex flex-1 flex-col rounded-l-md border py-3 px-2'>
                        {/* HEADER ACTION GROUP */}
                        <div className='flex space-x-2 pb-2'>
                            {/* ID */}
                            <input
                                type='text'
                                className='text-input w-16 py-1'
                                value={idFilter}
                                onChange={(e) => {
                                    setIdFilter(e.target.value);
                                }}
                                placeholder='Mã'
                            />
                            {/* Search */}
                            <input
                                type='text'
                                className='text-input flex-1 py-1'
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                placeholder='Tìm kiếm sản phẩm'
                            />
                        </div>

                        {/* LIST PRODUCT */}
                        <div className='flex-1'>
                            <Scrollbars autoHide autoHideTimeout={4000} autoHideDuration={200}>
                                <div className='grid grid-cols-3 gap-2'>
                                    {renderProduct.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onProductClick={() =>
                                                dispatch(
                                                    orderActions.add({
                                                        product,
                                                        price: product.price,
                                                        discount: product.discount,
                                                        priceDiscounted: product.priceDiscounted,
                                                    })
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </Scrollbars>
                        </div>
                    </div>

                    {/* RIGHT ORDER */}
                    <div className='flex h-full min-w-[700px] flex-1 flex-col rounded-r-md border py-5 px-2'>
                        <p className='text-center text-lg font-semibold'>Hóa đơn</p>

                        {/* LIST PRODUCT */}
                        <div className='mt-3 flex-1'>
                            <Table table={table} notFoundMessage='Chưa có sản phẩm trong hoá đơn' rowClickable={false} />
                            <Pagination table={table} />
                        </div>

                        <div className='flex items-end justify-between'>
                            <div className='flex flex-col content-between'>
                                <div className='flex items-center'>
                                    <div className='flex w-full justify-between gap-2 font-semibold'>
                                        <span>Tổng giá: </span>
                                        <span
                                            className={clsx('text-xl text-green-600', {
                                                'text-green-400 line-through': order.priceDiscounted != 0,
                                            })}
                                        >
                                            <span>
                                                <PriceFormat>{order.totalPrice}</PriceFormat>
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
                                                <PriceFormat>{order.priceDiscounted}</PriceFormat>
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
                                                <PriceFormat>{order.intoMoney}</PriceFormat>
                                            </span>
                                            <span> VNĐ</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                className={clsx('btn btn-blue btn-md h-14')}
                                disabled={!order.totalPrice}
                                onClick={() => setIsOpenPaymentDialog(true)}
                            >
                                <span className='pr-2'>
                                    <i className='fa-solid fa-circle-plus'></i>
                                </span>
                                <span>Tạo hoá đơn</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isOpenPaymentDialog && <PaymentDialog close={() => setIsOpenPaymentDialog(false)} meta={{ selectedProducts, order }} />}
        </>
    );
}

export default AddOrder;
