import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Popover } from '@headlessui/react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import DeleteDialog from '../../../components/DeleteDialog';
import HeaderCell from '../../../components/Table/HeaderCell';
import useModal from '../../../hooks/useModal';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import ShowWithFunc from '../../../components/ShowWithFunc';
import searchFilterFn from '../../../utils/searchFilterFn';
import TopBar from './TopBar';
import apiConfig from '../../../configs/apiConfig';

function ActionCell({ table, row }) {
    return (
        <div className='flex justify-center'>
            <ShowWithFunc func='role/update'>
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
            <ShowWithFunc func='role/delete'>
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
        size: 300,
        filterFn: searchFilterFn,
    },
    {
        accessorKey: 'description',
        header: (props) => <HeaderCell tableProps={props}>Mô tả</HeaderCell>,
        filterFn: searchFilterFn,
        size: 'full',
    },
    {
        id: 'action',
        header: '',
        cell: ActionCell,
        size: 200,
    },
];

function RoleList() {
    const [roles, setRoles] = useState([]);
    const [columnFilters, setColumnFilters] = useState([
        { id: 'name', value: '' },
        { id: 'description', value: '' },
    ]);

    const navigate = useNavigate();
    const [openDeleteDialog, closeDeleteDialog] = useModal({
        modal: DeleteDialog,
        meta: {
            onDelete: deleteRole,
        },
    });

    useEffect(() => {
        getRoles();
    }, []);

    function getRoles() {
        fetch(apiConfig.apiUrl + '/api/role')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setRoles(resJson.roles);
                } else {
                    setRoles([]);
                }
            });
    }

    function deleteRole(id) {
        fetch(apiConfig.apiUrl + '/api/role/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson) {
                    toast.success('Xóa chức vụ thành công!');
                    getRoles();
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
        data: roles,
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
                navigate('/role/detail/' + row.getValue('id'));
            },
            onEditButtonClick: (row) => {
                navigate('/role/update/' + row.getValue('id'));
            },
            onDeleteButtonClick: (row) => {
                openDeleteDialog({ deleteId: row.getValue('id') });
            },
        },
    });

    return (
        <div className='container space-y-4'>
            <TopBar filters={columnFilters} setFilters={setColumnFilters} />
            <div>
                <Table table={table} notFoundMessage='Không có chức vụ' />
                <Pagination table={table} />
            </div>
        </div>
    );
}

export default RoleList;
