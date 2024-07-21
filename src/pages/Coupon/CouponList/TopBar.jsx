import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import { getFilterValue, setFilterValueHandler } from '../../../utils/filterValueHelpper';
import ShowWithFunc from '../../../components/ShowWithFunc';

export default function TopBar({ filters, setFilters }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between space-x-4">
                <input
                    className="text-input flex-1"
                    placeholder="Tìm theo mã"
                    value={getFilterValue('name', filters) || ''}
                    onChange={(e) => setFilters(setFilterValueHandler('name', e.target.value))}
                />
                <input
                    className="text-input flex-1"
                    placeholder="Tìm theo mô tả"
                    value={getFilterValue('description', filters) || ''}
                    onChange={(e) =>
                        setFilters(setFilterValueHandler('description', e.target.value))
                    }
                />

                <ShowWithFunc func="coupon/add">
                    <Link to="/coupon/add" className="btn btn-md btn-blue">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        <span className="ml-2">Thêm phiếu giảm giá</span>
                    </Link>
                </ShowWithFunc>
            </div>
            <div className="flex items-center space-x-6">
                <div className="w-[300px]">
                    <label className="label !mb-0 cursor-default text-sm">Phần trăm giảm giá</label>
                    <div className="flex items-center space-x-1">
                        <input
                            className="text-input"
                            placeholder="Từ"
                            value={getFilterValue('discountPercent', filters)?.min || ''}
                            onChange={(e) =>
                                setFilters(
                                    setFilterValueHandler('discountPercent', (prev) => ({
                                        ...prev,
                                        min: e.target.value,
                                    }))
                                )
                            }
                        />
                        <div>-</div>
                        <input
                            className="text-input"
                            placeholder="Đến"
                            value={getFilterValue('discountPercent', filters)?.max || ''}
                            onChange={(e) =>
                                setFilters(
                                    setFilterValueHandler('discountPercent', (prev) => ({
                                        ...prev,
                                        max: e.target.value,
                                    }))
                                )
                            }
                        />
                    </div>
                </div>
                <div className="">
                    <label className="label !mb-0 cursor-default text-sm">Giới hạn</label>
                    <div className="flex h-9 items-center space-x-3">
                        <div
                            className="inline-flex items-center"
                            onClick={() =>
                                setFilters(
                                    setFilterValueHandler('isOneTime', (prev) => ({
                                        ...prev,
                                        notOneTime: !prev.notOneTime,
                                    }))
                                )
                            }
                        >
                            <input
                                className="!h-5 !w-5 accent-blue-600"
                                type="checkbox"
                                readOnly
                                checked={getFilterValue('isOneTime', filters).notOneTime}
                            />
                            <label className="cursor-pointer pl-2 font-semibold text-green-700">
                                Dùng nhiều lần
                            </label>
                        </div>
                        <div
                            className="inline-flex items-center"
                            onClick={() =>
                                setFilters(
                                    setFilterValueHandler('isOneTime', (prev) => ({
                                        ...prev,
                                        oneTime: !prev.oneTime,
                                    }))
                                )
                            }
                        >
                            <input
                                className="!h-5 !w-5 accent-blue-600"
                                type="checkbox"
                                readOnly
                                checked={getFilterValue('isOneTime', filters).oneTime}
                            />
                            <label
                                htmlFor="de-2"
                                className="cursor-pointer pl-2 font-semibold text-orange-600"
                            >
                                Dùng 1 lần
                            </label>
                        </div>
                    </div>
                </div>
                <div className="">
                    <label className="label !mb-0 cursor-default text-sm">Trạng thái</label>
                    <div className="flex h-9 items-center space-x-3">
                        <div
                            className="inline-flex items-center"
                            onClick={() =>
                                setFilters(
                                    setFilterValueHandler('isActive', (prev) => ({
                                        ...prev,
                                        active: !prev.active,
                                    }))
                                )
                            }
                        >
                            <input
                                className="!h-5 !w-5 accent-blue-600"
                                type="checkbox"
                                readOnly
                                checked={getFilterValue('isActive', filters).active}
                            />
                            <label className="cursor-pointer pl-2 font-semibold text-green-700">
                                Đang hoạt động
                            </label>
                        </div>
                        <div
                            className="inline-flex items-center"
                            onClick={() =>
                                setFilters(
                                    setFilterValueHandler('isActive', (prev) => ({
                                        ...prev,
                                        inactive: !prev.inactive,
                                    }))
                                )
                            }
                        >
                            <input
                                className="!h-5 !w-5 accent-blue-600"
                                type="checkbox"
                                readOnly
                                checked={getFilterValue('isActive', filters).inactive}
                            />
                            <label
                                htmlFor="de-2"
                                className="cursor-pointer pl-2 font-semibold text-red-600"
                            >
                                Không hoạt động
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
