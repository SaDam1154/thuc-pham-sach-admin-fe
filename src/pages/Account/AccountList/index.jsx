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
import apiConfig from '../../../configs/apiConfig';
function ActionCell({ table, row }) {
    return (
        <div className='flex justify-center'>
            <ShowWithFunc func='account/update'>
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
            <ShowWithFunc func='account/delete'>
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
        accessorKey: 'username',
        header: (props) => <HeaderCell tableProps={props}>Tên tài khoản</HeaderCell>,
        size: 300,
        filterFn: filterFns.includesString,
    },
    {
        accessorKey: 'name',
        header: (props) => <HeaderCell tableProps={props}>Họ tên</HeaderCell>,
        size: 'full',
        filterFn: searchFilterFn,
    },

    {
        id: 'role',
        accessorFn: (i) => i?.role?.name,
        header: (props) => <HeaderCell tableProps={props}>Chức vụ</HeaderCell>,
        size: 'full',
        filterFn: (...param) => {
            const value = param[2];
            if (value.length === 0) {
                return true;
            }
            return filterFns.arrIncludesSome(...param);
        },
    },
    {
        id: 'action',
        header: '',
        cell: ActionCell,
        size: 200,
    },
];

function AccountList() {
    const [accounts, setAccounts] = useState([]);
    const [columnFilters, setColumnFilters] = useState([
        {
            id: 'name',
            value: '',
        },
        {
            id: 'username',
            value: '',
        },
        {
            id: 'role',
            value: [],
        },
    ]);
    const navigate = useNavigate();
    const [openDeleteDialog, closeDeleteDialog] = useModal({
        modal: DeleteDialog,
        meta: {
            onDelete: deleteAccount,
        },
    });

    useEffect(() => {
        getAccounts();
    }, []);

    function getAccounts() {
        fetch(apiConfig.apiUrl + '/api/account')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setAccounts(resJson.accounts);
                } else {
                    setAccounts([]);
                }
            });
    }

    function deleteAccount(id) {
        fetch(apiConfig.apiUrl + '/api/account/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson) {
                    toast.success('Xóa tài khoản thành công!');
                    getAccounts();
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
        data: accounts,
        columns,
        state: {
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            onRowClick: (row) => {
                navigate('/account/detail/' + row.getValue('id'));
            },
            onEditButtonClick: (row) => {
                navigate('/account/update/' + row.getValue('id'));
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
                <Table table={table} notFoundMessage='Không có tài khoản' />
                <Pagination table={table} />
            </div>
        </div>
    );
}

export default AccountList;
