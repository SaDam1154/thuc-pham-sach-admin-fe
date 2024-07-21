import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
    filterFns,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import HeaderCell from '../../../components/Table/HeaderCell';
import Pagination from '../../../components/Table/Pagination';
import Table from '../../../components/Table';
import useModal from '../../../hooks/useModal';
import DeleteDialog from '../../../components/DeleteDialog';
import TopBar from './TopBar';
import searchFilterFn from '../../../utils/searchFilterFn';
import rangeFilterFn from '../../../utils/rangeFilterFn';
import ShowWithFunc from '../../../components/ShowWithFunc';
import PriceFormat from '../../../components/PriceFormat';
import apiConfig from '../../../configs/apiConfig';
function StatusCell({ getValue }) {
    return (
        <div className='flex justify-center'>
            <div
                className={clsx('rounded p-2 py-1 text-xs font-medium ', {
                    'bg-green-100 text-green-800': getValue() === 'active',
                    'bg-red-100 text-red-800': getValue() !== 'active',
                })}
            >
                {getValue() === 'active' ? 'Đang bán' : 'Không bán'}
            </div>
        </div>
    );
}

function NameAndImageCell({ row, getValue }) {
    const images = row.getValue('images');
    return (
        <div className='flex items-center space-x-2'>
            <img src={images?.[0] || '/placeholder.png'} className='h-10 w-10 rounded-full border object-cover' />
            <p className='flex-1'>{getValue()}</p>
        </div>
    );
}

function ActionCell({ table, row }) {
    return (
        <div className='flex justify-end'>
            <ShowWithFunc func='product/update'>
                <button
                    className='btn btn-yellow px-3 py-1'
                    onClick={(e) => {
                        e.stopPropagation();
                        table.options.meta?.onEditButtonClick(row);
                    }}
                >
                    Sửa
                </button>
            </ShowWithFunc>
            <ShowWithFunc func='product/delete'>
                <button
                    className='btn btn-red px-3 py-1'
                    onClick={(e) => {
                        e.stopPropagation();
                        table.options.meta?.onDeleteButtonClick(row);
                    }}
                >
                    Xoá
                </button>
            </ShowWithFunc>
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
        size: 60,
    },
    {
        accessorKey: 'name',
        header: (props) => <HeaderCell tableProps={props}>Tên</HeaderCell>,
        cell: NameAndImageCell,
        size: 'full',
        filterFn: searchFilterFn,
    },
    {
        id: 'type',
        accessorFn: (o) => o.type.name,
        header: (props) => <HeaderCell tableProps={props}>Danh mục</HeaderCell>,
        size: 120,
        enableSorting: false,
        filterFn: (...param) => {
            const value = param[2];
            if (value.length === 0) {
                return true;
            }
            return filterFns.arrIncludesSome(...param);
        },
    },
    {
        accessorKey: 'quantity',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Kho
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue()}</p>,
        size: 80,
        filterFn: rangeFilterFn,
    },
    {
        accessorKey: 'saledQuantity',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Đã bán
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue()}</p>,
        size: 120,
        filterFn: rangeFilterFn,
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
        size: 120,
        filterFn: rangeFilterFn,
    },
    {
        accessorKey: 'discount',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giảm giá
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
        size: 120,
        filterFn: rangeFilterFn,
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
        size: 120,
        filterFn: rangeFilterFn,
    },

    {
        accessorKey: 'status',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Trạng thái
            </HeaderCell>
        ),
        cell: StatusCell,
        size: 120,
        enableSorting: false,
        filterFn: (row, columnId, value) => {
            const statusValue = row.getValue(columnId);
            return value[statusValue];
        },
    },
    {
        id: 'action',
        header: '',
        cell: ActionCell,
        size: 140,
    },
    {
        id: 'images',
        accessorKey: 'images',
    },
];

function ProductList() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [columnFilters, setColumnFilters] = useState([
        {
            id: 'name',
            value: '',
        },
        {
            id: 'price',
            value: {
                min: '',
                max: '',
            },
        },
        {
            id: 'type',
            value: [],
        },
        {
            id: 'quantity',
            value: {
                min: '',
                max: '',
            },
        },
        {
            id: 'saledQuantity',
            value: {
                min: '',
                max: '',
            },
        },
        {
            id: 'status',
            value: {
                active: true,
                inactive: true,
            },
        },
        {
            id: 'discount',
            value: {
                active: true,
                inactive: true,
            },
        },
    ]);

    useEffect(() => {
        getProducts();
        console.log(products);
    }, []);

    const [openDeleteDialog, closeDeleteDialog] = useModal({
        modal: DeleteDialog,
        meta: {
            onDelete: deleteProduct,
        },
    });

    const table = useReactTable({
        data: products,
        columns,
        state: {
            columnFilters,
            columnVisibility: { images: false },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            onRowClick: (row) => {
                navigate('/product/detail/' + row.getValue('id'));
            },
            onEditButtonClick: (row) => {
                navigate('/product/update/' + row.getValue('id'));
            },
            onDeleteButtonClick: (row) => {
                openDeleteDialog({ deleteId: row.getValue('id') });
            },
        },
    });

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

    function deleteProduct(id) {
        fetch(apiConfig.apiUrl + '/api/product/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    toast.success('Xoá sản phẩm thành công');
                    getProducts();
                } else {
                    toast.error('Có lỗi xảy ra!');
                }
            })
            .catch(() => {
                toast.error('Có lỗi xảy ra!');
            })
            .finally(() => {
                closeDeleteDialog();
            });
    }

    return (
        <div className='container space-y-4'>
            <TopBar filters={columnFilters} setFilters={setColumnFilters} />
            <div>
                <Table table={table} notFoundMessage='Không có sản phẩm' />
                <Pagination table={table} />
            </div>
        </div>
    );
}

export default ProductList;
