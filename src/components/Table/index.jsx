import clsx from 'clsx';
import { flexRender } from '@tanstack/react-table';
import { Scrollbars } from 'react-custom-scrollbars';

export default function Table({
    table,
    notFoundMessage = 'Không có dữ liệu',
    rowClickable = true,
}) {
    return (
        <div className="data-table">
            <div className="thead">
                {table.getHeaderGroups().map((headerGroup) => (
                    <div className="tr" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <div
                                className="th"
                                style={{
                                    maxWidth: Number.isNaN(header.getSize())
                                        ? null
                                        : header.getSize(),
                                }}
                                key={header.id}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="tbody">
                <Scrollbars
                    autoHide
                    autoHideTimeout={4000}
                    autoHideDuration={200}
                    autoHeight
                    autoHeightMax={350}
                >
                    {table.getRowModel().rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="text-orange-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1}
                                    stroke="currentColor"
                                    className="h-12 w-12"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-700">{notFoundMessage}</p>
                        </div>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <div
                                className={clsx('tr', {
                                    '!cursor-default': !rowClickable,
                                })}
                                key={row.id}
                                onClick={() =>
                                    table.options.meta?.onRowClick &&
                                    table.options.meta?.onRowClick(row)
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div
                                        className="td"
                                        style={{
                                            maxWidth: Number.isNaN(cell.column.getSize())
                                                ? null
                                                : cell.column.getSize(),
                                        }}
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </Scrollbars>
            </div>
        </div>
    );
}
