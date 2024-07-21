import { useState } from 'react';
import clsx from 'clsx';

export default function DeleteDialog({ open, close, meta }) {
    return (
        <div
            className={clsx(
                'fixed inset-0 z-[99999] flex items-center justify-center bg-black/20 opacity-100 transition-opacity'
            )}
        >
            <div className="">
                <div className="min-w-[160px] max-w-[400px] rounded-lg bg-white p-6">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-9 w-9"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                    <div className="text-lg font-bold">Bạn có chắc chắn muốn xoá không?</div>
                    <p className="mt-2 text-gray-600">
                        Lưu ý: Bạn không thể không phục lại sau khi xoá!
                    </p>
                    <div className="mt-4 flex">
                        <button
                            className="btn btn-blue btn-md"
                            onClick={() => {
                                close();
                            }}
                        >
                            Quay lại
                        </button>
                        <button
                            className="btn btn-md btn-red"
                            onClick={() => {
                                meta?.onDelete(meta?.deleteId);
                            }}
                        >
                            Xoá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
