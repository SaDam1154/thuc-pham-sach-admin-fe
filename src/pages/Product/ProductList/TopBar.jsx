import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import { getFilterValue, setFilterValueHandler } from '../../../utils/filterValueHelpper';
import ShowWithFunc from '../../../components/ShowWithFunc';
import apiConfig from '../../../configs/apiConfig';

export default function TopBar({ filters, setFilters }) {
    const [productTypes, setProductTypes] = useState([]);
    const selectedProductTypes = getFilterValue('type', filters);

    useEffect(() => {
        getProductTypes();
    }, []);

    function getProductTypes() {
        fetch(apiConfig.apiUrl + '/api/product-type')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProductTypes(resJson.productTypes);
                } else {
                    setProductTypes([]);
                }
            });
    }
    return (
        <div className='space-y-1'>
            <div className='flex items-center justify-between'>
                <div></div>
                <ShowWithFunc func='product/add'>
                    <Link to='/product/add' className='btn btn-md btn-blue'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                        </svg>
                        <span className='ml-2'>Thêm sản phẩm</span>
                    </Link>
                </ShowWithFunc>
            </div>
            <div className='space-y-2'>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='label !mb-0 cursor-default text-sm'>Tìm kiếm</label>
                        <input
                            className='text-input'
                            placeholder='Tìm theo tên'
                            value={getFilterValue('name', filters) || ''}
                            onChange={(e) => setFilters(setFilterValueHandler('name', e.target.value))}
                        />
                    </div>
                    <div className='w-[200px]'>
                        <label className='label !mb-0 cursor-default text-sm'>Giá</label>
                        <div className='flex items-center space-x-1'>
                            <input
                                className='text-input'
                                placeholder='Từ'
                                value={getFilterValue('price', filters)?.min || ''}
                                onChange={(e) =>
                                    setFilters(
                                        setFilterValueHandler('price', (prev) => ({
                                            ...prev,
                                            min: e.target.value,
                                        }))
                                    )
                                }
                            />
                            <div>-</div>
                            <input
                                className='text-input'
                                placeholder='Đến'
                                value={getFilterValue('price', filters)?.max || ''}
                                onChange={(e) =>
                                    setFilters(
                                        setFilterValueHandler('price', (prev) => ({
                                            ...prev,
                                            max: e.target.value,
                                        }))
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className='w-[300px]'>
                        <label className='label !mb-0 cursor-default text-sm'>Danh mục</label>
                        <Listbox
                            value={selectedProductTypes}
                            onChange={(productTypeName) => setFilters(setFilterValueHandler('type', productTypeName))}
                            as='div'
                            className='relative'
                            multiple
                        >
                            <Listbox.Button as='div' className='text-input flex cursor-pointer items-center justify-between text-gray-700'>
                                <div className='flex-1'>
                                    {selectedProductTypes.length > 0 ? (
                                        <div className='text-sm font-medium'>
                                            <LinesEllipsis
                                                maxLine='1'
                                                ellipsis='...'
                                                trimRight
                                                basedOn='letters'
                                                text={`(${selectedProductTypes.length}) ` + selectedProductTypes.join(', ')}
                                            />
                                        </div>
                                    ) : (
                                        <div className='text-gray-500'>-- Chọn danh mục --</div>
                                    )}
                                </div>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='h-5 w-5'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                                </svg>
                            </Listbox.Button>
                            <Listbox.Options
                                as='div'
                                className='absolute top-full left-0 right-0 z-10 overflow-hidden rounded border bg-white py-2 shadow outline-none'
                            >
                                {productTypes.map((productType) => (
                                    <Listbox.Option
                                        as='div'
                                        className='cursor-pointer p-2 hover:bg-blue-100'
                                        key={productType.id}
                                        value={productType.name}
                                    >
                                        {({ active, selected }) => (
                                            <div className='flex items-center'>
                                                <div className='mr-1 w-6'>
                                                    {selected && (
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            viewBox='0 0 20 20'
                                                            fill='currentColor'
                                                            className='h-5 w-5'
                                                        >
                                                            <path
                                                                fillRule='evenodd'
                                                                d='M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z'
                                                                clipRule='evenodd'
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className='flex-1'>{productType.name}</div>
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                                <div className='flex justify-center border-t pt-2'>
                                    <button
                                        className='px-2 text-sm font-medium text-blue-600'
                                        onClick={() => setFilters(setFilterValueHandler('type', []))}
                                    >
                                        Xoá hết
                                    </button>
                                </div>
                            </Listbox.Options>
                        </Listbox>
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='w-[200px]'>
                        <label className='label !mb-0 cursor-default text-sm'>Kho</label>
                        <div className='flex items-center space-x-1'>
                            <input
                                className='text-input'
                                placeholder='Từ'
                                value={getFilterValue('quantity', filters)?.min || ''}
                                onChange={(e) =>
                                    setFilters(
                                        setFilterValueHandler('quantity', (prev) => ({
                                            ...prev,
                                            min: e.target.value,
                                        }))
                                    )
                                }
                            />
                            <div>-</div>
                            <input
                                className='text-input'
                                placeholder='Đến'
                                value={getFilterValue('quantity', filters)?.max || ''}
                                onChange={(e) =>
                                    setFilters(
                                        setFilterValueHandler('quantity', (prev) => ({
                                            ...prev,
                                            max: e.target.value,
                                        }))
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className='w-[200px]'>
                        <label className='label !mb-0 cursor-default text-sm'>Đã bán</label>
                        <div className='flex items-center space-x-1'>
                            <input
                                className='text-input'
                                placeholder='Từ'
                                value={getFilterValue('saledQuantity', filters)?.min || ''}
                                onChange={(e) =>
                                    setFilters(
                                        setFilterValueHandler('saledQuantity', (prev) => ({
                                            ...prev,
                                            min: e.target.value,
                                        }))
                                    )
                                }
                            />
                            <div>-</div>
                            <input
                                className='text-input'
                                placeholder='Đến'
                                value={getFilterValue('saledQuantity', filters)?.max || ''}
                                onChange={(e) =>
                                    setFilters(
                                        setFilterValueHandler('saledQuantity', (prev) => ({
                                            ...prev,
                                            max: e.target.value,
                                        }))
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className='w-[300px]'>
                        <label className='label !mb-0 cursor-default text-sm'>Trạng thái</label>
                        <div className='flex h-9 items-center space-x-3'>
                            <div
                                className='inline-flex items-center'
                                onClick={() =>
                                    setFilters(
                                        setFilterValueHandler('status', (prev) => ({
                                            ...prev,
                                            active: !prev.active,
                                        }))
                                    )
                                }
                            >
                                <input
                                    className='!h-5 !w-5 accent-blue-600'
                                    type='checkbox'
                                    readOnly
                                    checked={getFilterValue('status', filters).active}
                                />
                                <label className='cursor-pointer pl-2 font-semibold text-green-700'>Đang bán</label>
                            </div>
                            <div
                                className='inline-flex items-center'
                                onClick={() =>
                                    setFilters(
                                        setFilterValueHandler('status', (prev) => ({
                                            ...prev,
                                            inactive: !prev.inactive,
                                        }))
                                    )
                                }
                            >
                                <input
                                    className='!h-5 !w-5 accent-blue-600'
                                    type='checkbox'
                                    readOnly
                                    checked={getFilterValue('status', filters).inactive}
                                />
                                <label htmlFor='de-2' className='cursor-pointer pl-2 font-semibold text-orange-600'>
                                    Không bán
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
