import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Popover } from '@headlessui/react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import {
    filterFns,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import DeleteDialog from '../../../components/DeleteDialog';
import HeaderCell from '../../../components/Table/HeaderCell';
import useModal from '../../../hooks/useModal';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import ShowWithFunc from '../../../components/ShowWithFunc';
import TopBar from './TopBar';
import searchFilterFn from '../../../utils/searchFilterFn';
import rangeFilterFn from '../../../utils/rangeFilterFn';
import moment from 'moment';
import apiConfig from '../../../configs/apiConfig';

function ActionCell({ table, row }) {
    return (
        <div className='flex justify-center'>
            {/* <ShowWithFunc func="voucher/update">
                <button
                    className="btn btn-yellow px-3 py-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        table.options.meta?.onEditButtonClick(row);
                    }}
                >
                    Sửa
                </button>
            </ShowWithFunc> */}
            <ShowWithFunc func='voucher/delete'>
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
        accessorKey: 'description',
        header: (props) => <HeaderCell tableProps={props}>Mô tả</HeaderCell>,
        size: 'full',
        filterFn: searchFilterFn,
    },
    {
        accessorKey: 'discount.type',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Giảm theo
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-center'>{getValue() === 'percent' ? 'Phần trăm (%)' : 'Giá tiền (VNĐ)'}</p>,
    },
    {
        accessorKey: 'discount.value',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giảm
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue()}</p>,
        size: 150,
    },
    {
        accessorKey: 'limit',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Tối đa (VNĐ)
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue()}</p>,
        size: 150,
    },
    {
        accessorKey: 'end',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Hết hạn
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-center'>{moment(getValue()).format('DD/MM/YYYY')}</p>,
        enableSorting: true,
    },
    {
        accessorKey: 'id',
    },
    {
        id: 'action',
        header: '',
        cell: ActionCell,
        size: 200,
    },
];

function VoucherList() {
    const [vouchers, setVouchers] = useState([]);
    const [columnFilters, setColumnFilters] = useState([
        {
            id: 'description',
            value: '',
        },
    ]);
    const navigate = useNavigate();
    const [openDeleteDialog, closeDeleteDialog] = useModal({
        modal: DeleteDialog,
        meta: {
            onDelete: deleteVoucher,
        },
    });

    useEffect(() => {
        getVouchers();
    }, []);

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

    function deleteVoucher(id) {
        fetch(apiConfig.apiUrl + '/api/voucher/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson) {
                    toast.success('Xóa phiếu giảm giá thành công!');
                    getVouchers();
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
        data: vouchers,
        columns,
        state: {
            columnFilters,
            columnVisibility: { id: false },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            onRowClick: (row) => {
                navigate('/voucher/detail/' + row.getValue('id'));
            },
            onDeleteButtonClick: (row) => {
                openDeleteDialog({ deleteId: row.getValue('id') });
            },
        },
    });

    return (
        <div className='container space-y-4'>
            <TopBar filters={columnFilters} setFilters={setColumnFilters} />

            {/* LIST */}
            <div>
                <Table table={table} notFoundMessage='Không có phiếu giảm giá' rowClickable={false} />
                <Pagination table={table} />
            </div>
        </div>
    );
}

export default VoucherList;
