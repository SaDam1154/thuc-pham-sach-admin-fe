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
                    placeholder="Tìm theo mô tả"
                    value={getFilterValue('description', filters) || ''}
                    onChange={(e) =>
                        setFilters(setFilterValueHandler('description', e.target.value))
                    }
                />

                <ShowWithFunc func="promotion/add">
                    <Link to="/promotion/add" className="btn btn-md btn-blue">
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
                        <span className="ml-2">Thêm chương trình</span>
                    </Link>
                </ShowWithFunc>
            </div>
        </div>
    );
}
