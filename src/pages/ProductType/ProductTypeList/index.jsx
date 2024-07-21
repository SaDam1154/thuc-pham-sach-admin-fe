import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listbox, Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

import { useSelector } from 'react-redux';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { accountSelector } from '../../../redux/selectors';
import HeaderCell from '../../../components/Table/HeaderCell';
import DeleteDialog from '../../../components/DeleteDialog';
import useModal from '../../../hooks/useModal';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import ShowWithFunc from '../../../components/ShowWithFunc';
import TopBar from './TopBar';
import searchFilterFn from '../../../utils/searchFilterFn';
import apiConfig from '../../../configs/apiConfig';

function ActionCell({ table, row }) {
    return (
        <div className='flex justify-center'>
            <ShowWithFunc func='product-type/update'>
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
            <ShowWithFunc func='product-type/delete'>
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
        size: 100,
    },
    {
        accessorKey: 'name',
        header: (props) => <HeaderCell tableProps={props}>Tên</HeaderCell>,
        size: 'full',
        filterFn: searchFilterFn,
    },
    {
        accessorKey: 'nameEN',
        header: (props) => <HeaderCell tableProps={props}>Tên tiếng Anh</HeaderCell>,
        size: 'full',
        filterFn: searchFilterFn,
    },
    {
        accessorKey: 'createdAt',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Ngày tạo
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-center'>{moment(getValue()).format('HH:mm:ss DD/MM/YYYY ')}</p>,
        size: 300,
    },
    {
        id: 'action',
        header: '',
        cell: ActionCell,
        size: 200,
    },
];

function ProductTypeList() {
    const [productTypes, setProductTypes] = useState([]);
    const navigate = useNavigate();
    const [openDeleteDialog, closeDeleteDialog] = useModal({
        modal: DeleteDialog,
        meta: {
            onDelete: deleteProductType,
        },
    });
    const [columnFilters, setColumnFilters] = useState([{ id: 'name', value: '' }]);

    useEffect(() => {
        getProductTypes();
    }, []);

    function getProductTypes() {
        fetch(apiConfig.apiUrl + '/api/product-type')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProductTypes(resJson.productTypes);
                } else {
                    setProductTypes([]);
                }
            });
    }

    function deleteProductType(id) {
        fetch(apiConfig.apiUrl + '/api/product-type/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson) {
                    toast.success('Xóa loại sản phẩm thành công!');
                    getProductTypes();
                } else {
                    showErorrNoti();
                }
            })
            .catch(() => {
                toast.error('Có lỗi xảy ra!');
            })
            .finally(() => {
                closeDeleteDialog();
            });
    }

    const table = useReactTable({
        data: productTypes,
        columns,
        state: {
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            onEditButtonClick: (row) => {
                navigate('/product-type/update/' + row.getValue('id'));
            },
            onDeleteButtonClick: (row) => {
                openDeleteDialog({ deleteId: row.getValue('id') });
            },
        },
    });

    return (
        <div className='container max-w-[900px] space-y-4'>
            <TopBar filters={columnFilters} setFilters={setColumnFilters} />
            <div>
                <Table table={table} notFoundMessage='Không có loại sản phẩm' rowClickable={false} />
                <Pagination table={table} />
            </div>
        </div>
    );
}

export default ProductTypeList;
