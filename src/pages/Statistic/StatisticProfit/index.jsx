import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PriceFormat from '../../../components/PriceFormat';
import apiConfig from '../../../configs/apiConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

export default function StatisticProfit() {
    const [orders, setOrders] = useState([]);
    const [imports, setImports] = useState([]);
    const [rangeDateValue, setRangeDateValue] = useState({
        startDate: moment(new Date()).subtract(6, 'd').format('YYYY-MM-DD'),
        endDate: moment(new Date()).format('YYYY-MM-DD'),
    });

    useEffect(() => {
        fetch(apiConfig.apiUrl + '/api/order')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setOrders(resJson.orders);
                }
            });
        fetch(apiConfig.apiUrl + '/api/import')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setImports(resJson.imports);
                }
            });
    }, []);

    const data = useMemo(() => {
        if (!rangeDateValue.startDate || !rangeDateValue.endDate) {
            return {};
        }
        let startDate = moment(rangeDateValue.startDate);
        let endDate = moment(rangeDateValue.endDate);
        let dates = [];

        for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'd')) {
            dates.push(m.format('DD/MM/YYYY'));
        }

        const importMoneySets = dates.map((date) =>
            imports.filter((i) => moment(i.createdAt).format('DD/MM/YYYY') === date).reduce((prev, curr) => prev + curr.totalPrice, 0)
        );

        const orderMoneySets = dates.map((date) =>
            orders.filter((i) => moment(i.createdAt).format('DD/MM/YYYY') === date).reduce((prev, curr) => prev + curr.intoMoney, 0)
        );

        return {
            labels: dates,
            summary: {
                importMoney: importMoneySets.reduce((prev, curr) => prev + curr, 0),
                orderMoney: orderMoneySets.reduce((prev, curr) => prev + curr, 0),
            },
            datasets: [
                {
                    label: 'Tiền nhập hàng',
                    data: importMoneySets,
                    backgroundColor: '#ef4444',
                    stack: 'Stack 0',
                },
                {
                    label: 'Tiền bán sản phẩm',
                    data: orderMoneySets,
                    backgroundColor: '#059669',
                    stack: 'Stack 1',
                },
                {
                    label: 'Lợi nhuận',
                    data: dates.map((_, index) => orderMoneySets[index] - importMoneySets[index]),
                    backgroundColor: '#0284c7',
                    stack: 'Stack 2',
                },
            ],
        };
    }, [orders, imports, rangeDateValue.startDate, rangeDateValue.endDate]);

    return (
        <div className='container flex flex-col'>
            <Datepicker
                value={rangeDateValue}
                i18n={'en'}
                configs={{
                    shortcuts: {
                        today: 'Hôm nay',
                        yesterday: 'Hôm qua',
                        past: (period) => `${period} ngày trước`,
                        currentMonth: 'Tháng này',
                        pastMonth: 'Tháng trước',
                    },
                }}
                inputClassName='border-2 border-gray-500 outline-none w-full text-base !py-1.5 hover:border-blue-500'
                displayFormat={'DD/MM/YYYY'}
                separator={'đến'}
                onChange={(newValue) => setRangeDateValue(newValue)}
                showShortcuts={true}
            />

            <div className='flex flex-1 space-x-3 pt-3'>
                <div className='min-w-[210px] space-y-3'>
                    <div className='rounded-md bg-red-500 p-2 text-white'>
                        <p className='font-medium opacity-80'>Tổng tiền nhập hàng</p>
                        <p className='space-x-1 text-2xl font-bold'>
                            <span>
                                <PriceFormat>{data?.summary?.importMoney}</PriceFormat>
                            </span>
                            <span>VNĐ</span>
                        </p>
                    </div>
                    <div className='rounded-md bg-emerald-600 p-2 text-white'>
                        <p className='font-medium opacity-80'>Tổng tiền bán hàng</p>
                        <p className='space-x-1 text-2xl font-bold'>
                            <span>
                                <PriceFormat>{data?.summary?.orderMoney}</PriceFormat>
                            </span>
                            <span>VNĐ</span>
                        </p>
                    </div>
                    <div className='rounded-md bg-cyan-600 p-2 text-white'>
                        <p className='font-medium opacity-80'>Lợi nhuận</p>
                        <p className='space-x-1 text-2xl font-bold'>
                            <span>
                                <PriceFormat>{data?.summary?.orderMoney - data?.summary?.importMoney}</PriceFormat>
                            </span>
                            <span>VNĐ</span>
                        </p>
                    </div>
                </div>
                <div className='flex-1'>
                    <Bar options={options} data={data} />
                </div>
            </div>
        </div>
    );
}
