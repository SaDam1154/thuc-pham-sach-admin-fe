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
function CustomerDetail() {
    const { id } = useParams();
    const [customer, setCustomer] = useState({});
    useEffect(() => {
        getCustomer();
    }, []);

    function getCustomer() {
        fetch(apiConfig.apiUrl + '/api/customer' + '/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setCustomer(resJson.customer);
                } else {
                    setCustomer({});
                }
            });
    }
    return (
        <div className='container'>
            <div className='mx-auto mt-5 max-w-[700px] rounded-xl border border-slate-300 p-5'>
                <div className='relative flex pt-10'>
                    <div className='h-[150px] w-[150px] rounded-full border'>
                        <img className='h-full w-full rounded-full object-cover' src={customer?.avatar || '/placeholder.png'} />
                    </div>
                    <div className='ml-8 flex-1 space-y-3'>
                        <div className='mb-4 flex flex-col'>
                            <label className='label pointer-events-none'>Mã khách hàng:</label>
                            <p className='font-medium text-blue-600'>{customer?.id}</p>
                        </div>
                        <div className='mb-4 flex flex-col'>
                            <label className='label pointer-events-none'>Số điện thoại:</label>
                            <p className='font-medium text-blue-600'>{customer?.phone}</p>
                        </div>

                        <div className='flex flex-col'>
                            <label className='label pointer-events-none'>Tên khách hàng:</label>
                            <p className='text-xl font-medium'>{customer?.name}</p>
                        </div>

                        <div className='flex flex-col'>
                            <label className='label pointer-events-none'>Địa chỉ *</label>
                            <p>{customer?.address}</p>
                        </div>
                    </div>
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/customer'} className='btn btn-red btn-md'>
                        <span className='pr-2'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Hủy</span>
                    </Link>
                    <ShowWithFunc func='customer/update'>
                        <Link to={'customer/update/' + id} className='btn btn-blue btn-md'>
                            <span className='pr-2'>
                                <i className='fa-solid fa-circle-plus'></i>
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
export default CustomerDetail;
