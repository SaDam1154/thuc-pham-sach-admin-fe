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

function PromotionDetail() {
    const { id } = useParams();
    const [promotion, setPromotion] = useState({});
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        callApi();
        getVouchers();
    }, []);

    function callApi() {
        fetch(apiConfig.apiUrl + '/api/promotion-program/' + id)
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setPromotion(resJson.promotionProgram);
                } else {
                    setPromotion({});
                }
            });
    }

    function getVouchers() {
        fetch(apiConfig.apiUrl + '/api/voucher')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setVouchers(resJson.vouchers);
                    console.log(resJson.vouchers);
                } else {
                    setVouchers([]);
                }
            });
    }

    console.log({ promotion });
    return (
        <div className='container'>
            <div className='wrapper mx-[10%] rounded-xl border border-slate-300 p-5'>
                <div className='mt-4 flex'>
                    <div className='mt-[4%] flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold'>Mã chương trình</label>
                        <div className='py-2'>{promotion?.id}</div>
                    </div>
                </div>

                <div className='mt-4 flex'>
                    <div className='mt-2 flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold' htmlFor='name'>
                            Mô tả chương trình
                        </label>
                        <div className='py-2'>{promotion?.description}</div>
                    </div>
                </div>

                <div className='mt-4 mb-4 flex'>
                    <div className='mt-2 flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold'>Bắt đầu</label>
                        <div className='py-2'>{moment(promotion?.start).format('DD/MM/YYYY')}</div>
                    </div>

                    <div className='mt-2 flex w-full flex-col'>
                        <label className='mb-1 cursor-default text-lg font-semibold'>Kết thúc</label>
                        <div className='py-2'>{moment(promotion?.end).format('DD/MM/YYYY')}</div>
                    </div>
                </div>
                <div className='mt-2'>
                    <label className='mb-1 cursor-default text-lg font-semibold'>Danh sách phiếu giảm giá</label>
                    {vouchers
                        ?.filter((v) => promotion?.vouchers?.find((_v) => _v === v?.id))
                        ?.map((v) => (
                            <div key={v?.id} className='mt-1 flex rounded-sm border p-2'>
                                <div className='mr-2'>{'Mã: ' + v?.id + ' |'}</div>
                                <div>{v?.description}</div>
                            </div>
                        ))}
                </div>

                <div className='mt-6 flex items-center justify-end border-t pt-6'>
                    <Link to={'/promotion'} className='btn btn-blue btn-md'>
                        <span className='pr-1'>
                            <i className='fa-solid fa-circle-xmark'></i>
                        </span>
                        <span>Quay lại</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
//
//
export default PromotionDetail;
