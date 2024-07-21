import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function Pagination({ table, initPageSize = 5 }) {
    const [pageSize, setPageSize] = useState(initPageSize);
    useEffect(() => {
        table.setPageSize(pageSize);
    }, []);

    function getRecordsInfo() {
        const numberOfRecords = table.getFilteredRowModel().rows.length;
        let firstRecordIndex = table.getState().pagination.pageIndex * pageSize;
        const lastRecordIndex = firstRecordIndex + table.getPaginationRowModel().rows.length - 1;
        if (numberOfRecords === 0) {
            firstRecordIndex = -1;
        }
        return { firstRecordIndex, lastRecordIndex, numberOfRecords };
    }
    const recordsInfo = getRecordsInfo();

    return (
        <div className="mt-3 flex justify-end">
            <div className="flex items-center space-x-5 text-sm text-gray-700">
                <div className="flex items-center space-x-1">
                    <span>Mỗi trang: </span>
                    <select
                        className="cursor-pointer rounded border px-1 py-1"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(e.target.value);
                            table.setPageSize(e.target.value);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <div>
                    <span>Hàng </span>
                    <span className="font-medium">{recordsInfo.firstRecordIndex + 1}</span>
                    <span> - </span>
                    <span className="font-medium">{recordsInfo.lastRecordIndex + 1}</span>
                    <span> trên </span>
                    <span className="font-medium">{recordsInfo.numberOfRecords}</span>
                </div>
                <div>
                    <span>Trang </span>
                    <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>
                    <span> / </span>
                    <span className="font-medium">
                        {table.getPageCount() || table.getPageCount() + 1}
                    </span>
                </div>
                <div className="flex">
                    <button
                        className={clsx('rounded p-1 hover:bg-gray-100', {
                            'pointer-events-none opacity-50': !table.getCanPreviousPage(),
                        })}
                        onClick={() => table.setPageIndex(0)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.75 19.5l-7.5-7.5 7.5-7.5M9.2 4.5v15"
                            />
                        </svg>
                    </button>
                    <button
                        className={clsx('rounded p-1 hover:bg-gray-100', {
                            'pointer-events-none opacity-50': !table.getCanPreviousPage(),
                        })}
                        onClick={() => table.previousPage()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <button
                        className={clsx('rounded p-1 hover:bg-gray-100', {
                            'pointer-events-none opacity-50': !table.getCanNextPage(),
                        })}
                        onClick={() => table.nextPage()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                    <button
                        className={clsx('rounded p-1 hover:bg-gray-100', {
                            'pointer-events-none opacity-50': !table.getCanNextPage(),
                        })}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5 rotate-180"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.75 19.5l-7.5-7.5 7.5-7.5M9.2 4.5v15"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
