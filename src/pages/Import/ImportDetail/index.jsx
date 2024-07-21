import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Table from '../../../components/Table';
import Pagination from '../../../components/Table/Pagination';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import PriceFormat from '../../../components/PriceFormat';
import ReactToPrint from 'react-to-print';
import HeaderCell from '../../../components/Table/HeaderCell';
import apiConfig from '../../../configs/apiConfig';
function NameAndImageCell({ row, getValue }) {
    const image = row.getValue('image');
    return (
        <div className='flex items-center space-x-2'>
            <img src={image || '/placeholder.png'} className='bimport h-10 w-10 rounded-full object-cover' />
            <p className='flex-1'>{getValue()}</p>
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
        id: 'product',
        accessorFn: (item) => item?.product?.name,
        header: (props) => <HeaderCell tableProps={props}>Sản phẩm</HeaderCell>,
        cell: NameAndImageCell,
        size: 'full',
    },
    {
        accessorKey: 'importPrice',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                Giá nhập
            </HeaderCell>
        ),
        cell: ({ getValue }) => (
            <p className='text-right'>
                <PriceFormat>{getValue()}</PriceFormat>
            </p>
        ),
        size: 120,
    },
    {
        accessorKey: 'quantity',
        header: (props) => (
            <HeaderCell align='right' tableProps={props}>
                SL
            </HeaderCell>
        ),
        cell: ({ getValue }) => <p className='text-right'>{getValue()}</p>,
        size: 80,
    },
    {
        id: 'image',
        accessorFn: (item) => item?.product?.images?.[0],
    },
];

function ImportDetail() {
    const { id } = useParams();
    const [_import, setImport] = useState({});
    const componentRef = useRef();
    useEffect(() => {
        getImport();
    }, []);

    function getImport() {
        fetch(apiConfig.apiUrl + '/api/import/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setImport(resJson.import);
                } else {
                    setImport({});
                }
            })
            .catch((error) => {
                console.log(error);
                setImport({});
            });
    }
    const table = useReactTable({
        data: _import.details || [],
        columns,
        state: {
            columnVisibility: { image: false },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {},
    });

    return (
        <div className='container'>
            <div className='mt-5 flex space-x-6' ref={componentRef}>
                {/* PRODUCT */}
                <div className='min-w-[700px] flex-1'>
                    <Table table={table} notFoundMessage='Không có sản phẩm' rowClickable={false} />
                    <Pagination table={table} />
                </div>

                {/* INFOR */}
                <div className='flex-1'>
                    <div className='bimport-b space-y-2 pb-2'>
                        <div>
                            <span className='text-gray-700'>Ngày lập: </span>
                            <span className='text-lg font-semibold text-gray-900'>
                                {moment(_import.createdAt).format('HH:mm DD/MM/YYYY ')}
                            </span>
                        </div>

                        {_import?.note && (
                            <div>
                                <p className='text-gray-700'>Ghi chú: </p>
                                <span className='text-lg font-semibold text-gray-900'>{_import.note}</span>
                            </div>
                        )}
                    </div>

                    <div className='bimport-b mt-3 space-y-3 pb-3'>
                        <div>
                            <span className='text-gray-700'>Tổng tiền: </span>
                            <span className='text-xl font-semibold text-blue-600'>
                                <span>
                                    <PriceFormat>{_import?.totalPrice}</PriceFormat>
                                </span>
                                <span> VNĐ</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' flex justify-end'>
                <Link to='/import' className='btn btn-blue btn-md'>
                    Quay lại
                </Link>
                <ReactToPrint
                    trigger={() => <button className='btn btn-green btn-md'>In phiếu nhập</button>}
                    content={() => componentRef.current}
                />
            </div>
        </div>
    );
}
//
//
export default ImportDetail;
