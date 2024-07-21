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
            {/* <ShowWithFunc func="promotion/update">
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
            <ShowWithFunc func='promotion/delete'>
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
        accessorKey: 'start',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Từ ngày
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-center'>{moment(getValue()).format('DD/MM/YYYY')}</p>,
        size: 200,
        enableSorting: true,
    },
    {
        accessorKey: 'end',
        header: (props) => (
            <HeaderCell align='center' tableProps={props}>
                Đến ngày
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-center'>{moment(getValue()).format('DD/MM/YYYY')}</p>,
        size: 200,
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

function PromotionList() {
    const [promotions, setPromotions] = useState([]);
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
            onDelete: deletePromotion,
        },
    });

    useEffect(() => {
        getPromotions();
    }, []);

    function getPromotions() {
        fetch(apiConfig.apiUrl + '/api/promotion-program')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setPromotions(resJson.promotionPrograms);
                    console.log(resJson.promotionPrograms);
                } else {
                    setPromotions([]);
                }
            });
    }

    function deletePromotion(id) {
        fetch(apiConfig.apiUrl + '/api/promotion-program/' + id, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson) {
                    toast.success('Xóa chương trình giảm giá thành công!');
                    getPromotions();
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
        data: promotions,
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
                navigate('/promotion/detail/' + row.getValue('id'));
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
                <Table table={table} notFoundMessage='Không có phiếu giảm giá' rowClickable={true} />
                <Pagination table={table} />
            </div>
        </div>
    );
}

export default PromotionList;
