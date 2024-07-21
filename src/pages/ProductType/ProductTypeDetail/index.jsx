import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { accountSelector } from '../../../redux/selectors';
import ShowWithFunc from '../../../components/ShowWithFunc';
import apiConfig from '../../../configs/apiConfig';

function ProductTypeDetail() {
    const { id } = useParams();
    const [productType, setProductType] = useState({});

    useEffect(() => {
        callApi();
    }, []);

    function callApi() {
        fetch(apiConfig.apiUrl + '/api/product-type' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setProductType(resJson.productType);
                } else {
                    setProductType({});
                }
            });
    }
    return (
        <div className='container'>
            <div className='wrapper mx-[10%] rounded-xl  border border-slate-300 p-5'>
                <div className='mt-4 flex flex-row'>
                    <div className='mt-[4%] flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold'>Mã loại sản phẩm</label>
                        <div className='text-input disabled select-none py-[5px]'>{productType.id}</div>
                    </div>
                </div>

                <div className='mt-4 flex flex-row'>
                    <div className='mt-2 flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold' htmlFor='name'>
                            Tên loại sản phẩm
                        </label>
                        <div className='text-input disabled select-none py-[5px]'>{productType.name}</div>
                    </div>
                </div>
                <div className='mt-4 flex flex-row'>
                    <div className='mt-2 flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold' htmlFor='name'>
                            Tên loại sản phẩm tiếng Anh
                        </label>
                        <div className='text-input disabled select-none py-[5px]'>{productType.nameEN}</div>
                    </div>
                </div>

                <div className='mt-4 mb-4 flex flex-row'>
                    <div className='mt-2 flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold' htmlFor='date'>
                            Ngày thêm
                        </label>
                        <div className='text-input disabled select-none py-[5px]'>
                            {moment(productType.createdAt).format('(HH:mm:ss)     DD/MM/YYYY')}
                        </div>
                    </div>
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/product-type'} className='btn btn-blue btn-md'>
                        <span className='pr-1'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Quay lại</span>
                    </Link>
                    <ShowWithFunc func='product-type/update'>
                        <Link to={'/product-type/update/' + productType.id} className='btn btn-md btn-blue'>
                            <span className='pr-2'>
                                <i className='fa fa-share' aria-hidden='true'></i>
                            </span>
                            <span>Chỉnh sửa</span>
                        </Link>
                    </ShowWithFunc>
                </div>
            </div>
        </div>
    );
}
//
//
export default ProductTypeDetail;
