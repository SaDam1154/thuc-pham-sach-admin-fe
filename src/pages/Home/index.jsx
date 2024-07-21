import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { accountActions } from '../../redux/slices/accountSlide';
import { accountSelector } from '../../redux/selectors';

function Home() {
    const dispatch = useDispatch();
    const account = useSelector(accountSelector);
    const showLogoutNoti = () => toast.info('Đã đăng xuất!');
    return (
        <div className='container flex h-full w-full items-center justify-center space-x-11 px-10'>
            <div className='flex-1'>
                <img className='w-full object-cover' src='/banner.jpg' />
            </div>

            <div className='flex-1 text-gray-600'>
                <p className='mb-2 text-5xl font-extrabold text-orange-500'>QUẢN LÝ</p>
                <p className='mb-8 text-4xl font-bold text-orange-500'>CỬA HÀNG THỰC PHẨM SẠCH</p>

                <p className='font-gray-900 mb-8 text-4xl font-bold'>{'Xin chào, ' + account?.name}</p>

                <button
                    className='btn btn-md btn-blue mb-10'
                    onClick={() => {
                        dispatch(accountActions.logout());
                        showLogoutNoti();
                    }}
                >
                    <span className='pr-1'>
                        <i className='fa-solid fa-right-from-bracket'></i>
                    </span>
                    <span>Đăng xuất</span>
                </button>

                <p className='text-xl font-bold'>Nếu cần hỗ trợ kỹ thuật, vui lòng thực hiện một trong ba cách sau:</p>
                <p className='text-lg '>
                    <span>1. Truy cập </span>
                    <a href='https://forum.uit.edu.vn/' className='underline hover:text-blue-600'>
                        https://forum.uit.edu.vn/
                    </a>
                    <span> và gửi yêu cầu hỗ trợ.</span>
                </p>
                <p className='text-lg'>
                    <span>2. Gửi email cho phòng kỹ thuật: </span>
                    <span className='underline'>20521154@gm.uit.edu.vn</span>
                </p>
                <p className='text-lg '>
                    <span>
                        <span>3. Gọi HOTLINE hỗ trợ khách hàng: </span>
                        <span className='underline'>0365011369</span>
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Home;
