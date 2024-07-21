import clsx from 'clsx';

export default function HeaderCell({ tableProps, align = 'left', children }) {
    return (
        <div
            className={clsx('-mx-4 flex h-full items-center space-x-1 px-4', {
                'justify-center': align === 'center',
                'justify-end': align === 'right',
                'cursor-pointer hover:bg-gray-200': tableProps.column.getCanSort(),
            })}
            onClick={tableProps.column.getToggleSortingHandler()}
        >
            <span>{children}</span>
            {tableProps.column.getCanSort() &&
                ({
                    asc: (
                        <span className="text-blue-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                                />
                            </svg>
                        </span>
                    ),
                    desc: (
                        <span className="text-blue-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                                />
                            </svg>
                        </span>
                    ),
                }[tableProps.column.getIsSorted()] || (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                    </svg>
                ))}
        </div>
    );
}
