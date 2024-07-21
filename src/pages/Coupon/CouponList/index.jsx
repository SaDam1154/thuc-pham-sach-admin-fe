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
import apiConfig from '../../../configs/apiConfig';
function ActionCell({ table, row }) {
    return (
        <div className='flex justify-center'>
            <ShowWithFunc func='coupon/update'>
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
            <ShowWithFunc func='coupon/delete'>
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

function IsOneTimeCell({ getValue }) {
    return !getValue() ? (
        <div className='text-center text-sm font-semibold text-green-600'>Dùng nhiều lần</div>
    ) : (
        <div className='text-center text-sm font-semibold text-orange-600'>Dùng 1 lần</div>
    );
}

function IsActiveCell({ getValue }) {
    return (
        <div className='flex justify-center'>
            <div
                className={clsx('rounded p-2 py-1 text-xs font-medium ', {
                    'bg-green-100 text-green-800': getValue(),
                    'bg-red-100 text-red-800': !getValue(),
                })}
            >
                {getValue() ? 'Đang hoạt động' : 'Không hoạt động'}
            </div>
        </div>
    );
}

const columns = [
    {
        accessorKey: 'name',
        header: (props) => <HeaderCell tableProps={props}>Mã</HeaderCell>,
        size: 150,
        filterFn: filterFns.includesString,
    },
    {
        accessorKey: 'discountPercent',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giảm giá
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue() + '%'}</p>,
        size: 150,
        filterFn: rangeFilterFn,
    },
    {
        accessorKey: 'description',
        header: (props) => <HeaderCell tableProps={props}>Mô tả</HeaderCell>,
        size: 'full',
        filterFn: searchFilterFn,
    },
    {
        accessorKey: 'isOneTime',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Giới hạn
            </HeaderCell>
        ),
        cell: IsOneTimeCell,
        enableSorting: false,
        size: 150,
        filterFn: (row, columnId, value) => {
            const isOneTimeValue = row.getValue(columnId);
            if (isOneTimeValue && value.oneTime) {
                return true;
            }
            if (!isOneTimeValue && value.notOneTime) {
                return true;
            }
            return false;
        },
    },
    {
        accessorKey: 'isActive',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Trạng thái
            </HeaderCell>
        ),
        cell: IsActiveCell,
        enableSorting: false,
        size: 150,
        filterFn: (row, columnId, value) => {
            const isActive = row.getValue(columnId);
            if (isActive && value.active) {
                return true;
            }
            if (!isActive && value.inactive) {
                return true;
            }
            return false;
        },
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

function CouponList() {
    const [coupons, setCoupons] = useState([]);
    const [columnFilters, setColumnFilters] = useState([
        {
            id: 'name',
            value: '',
        },
        {
            id: 'description',
            value: '',
        },
        {
            id: 'discountPercent',
            value: {
                min: '',
                max: '',
            },
        },
        {
            id: 'isOneTime',
            value: {
                oneTime: true,
                notOneTime: true,
            },
        },
        {
            id: 'isActive',
            value: {
                active: true,
                inactive: true,
            },
        },
    ]);
    const navigate = useNavigate();
    const [openDeleteDialog, closeDeleteDialog] = useModal({
        modal: DeleteDialog,
        meta: {
            onDelete: deleteCoupon,
        },
    });

    useEffect(() => {
        getCoupons();
    }, []);

    function getCoupons() {
        fetch(apiConfig.apiUrl + '/api/coupon')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCoupons(resJson.coupons);
                } else {
                    setCoupons([]);
                }
            });
    }

    function deleteCoupon(id) {
        fetch(apiConfig.apiUrl + '/api/coupon/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson) {
                    toast.success('Xóa phiếu giảm giá thành công!');
                    getCoupons();
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
        data: coupons,
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
            onEditButtonClick: (row) => {
                navigate('/coupon/update/' + row.getValue('id'));
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

export default CouponList;
