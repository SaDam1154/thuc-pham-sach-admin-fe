import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

import Datepicker from 'react-tailwindcss-datepicker';
import { date } from 'yup/lib/locale';
import apiConfig from '../../../configs/apiConfig';

const COLORS = ['#dc2626', '#059669', '#d97706', '#0891b2', '#4f46e5', '#c026d3', '#475569'];

export default function StatisticProduct() {
    const [orderDetails, setOrderDetails] = useState([]);
    const [importDetails, setImportDetails] = useState([]);
    const [rangeDateValue, setRangeDateValue] = useState({
        startDate: moment(new Date()).subtract(6, 'd').format('YYYY-MM-DD'),
        endDate: moment(new Date()).format('YYYY-MM-DD'),
    });

    useEffect(() => {
        fetch(apiConfig.apiUrl + '/api/detail-order')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setOrderDetails(resJson.detailOrders);
                }
            });
        fetch(apiConfig.apiUrl + '/api/detail-import')
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.success) {
                    setImportDetails(resJson.detailImports);
                }
            });
    }, []);

    const dataImport = useMemo(() => {
        if (!rangeDateValue.startDate || !rangeDateValue.endDate) {
            return {};
        }
        let startDate = moment(rangeDateValue.startDate);
        let endDate = moment(rangeDateValue.endDate);

        const _productImports = importDetails.reduce((prev, curr) => {
            const createdAt = moment(moment(curr.createdAt).format('YYYY-MM-DD'));
            if (createdAt.isBefore(startDate) || createdAt.isAfter(endDate)) {
                return prev;
            }
            if (!curr.product) {
                return prev;
            }

            if (prev[curr.product._id]) {
                return {
                    ...prev,
                    [curr.product._id]: {
                        ...prev[curr.product._id],
                        quantity: prev[curr.product._id].quantity + curr.quantity,
                    },
                };
            }
            return {
                ...prev,
                [curr.product._id]: {
                    name: curr.product.name,
                    quantity: curr.quantity,
                },
            };
        }, {});

        let productImports = Object.keys(_productImports)
            .map((key) => _productImports[key])
            .sort((a, b) => b.quantity - a.quantity);

        if (productImports.length > 7) {
            const orderProduct = {
                name: 'Sản phẩm khác',
                quantity: productImports.reduce((prev, curr, index) => (index >= 6 ? prev + curr.quantity : prev), 0),
            };
            productImports = productImports.slice(0, 6);
            productImports.push(orderProduct);
        }

        return {
            labels: productImports.map((p) => p.name),
            datasets: [
                {
                    label: 'Số lượng',
                    data: productImports.map((p) => p.quantity),
                    backgroundColor: productImports.map((_, index) => COLORS[index]),
                    borderColor: '#888',
                    borderWidth: 1,
                },
            ],
        };
    }, [importDetails, rangeDateValue.startDate, rangeDateValue.endDate]);

    const dataOrder = useMemo(() => {
        if (!rangeDateValue.startDate || !rangeDateValue.endDate) {
            return {};
        }
        let startDate = moment(rangeDateValue.startDate);
        let endDate = moment(rangeDateValue.endDate);

        const _productOrders = orderDetails.reduce((prev, curr) => {
            const createdAt = moment(moment(curr.createdAt).format('YYYY-MM-DD'));
            if (createdAt.isBefore(startDate) || createdAt.isAfter(endDate)) {
                return prev;
            }
            if (!curr.product) {
                return prev;
            }

            if (prev[curr.product._id]) {
                return {
                    ...prev,
                    [curr.product._id]: {
                        ...prev[curr.product._id],
                        quantity: prev[curr.product._id].quantity + curr.quantity,
                    },
                };
            }
            return {
                ...prev,
                [curr.product._id]: {
                    name: curr.product.name,
                    quantity: curr.quantity,
                },
            };
        }, {});

        let productOrders = Object.keys(_productOrders)
            .map((key) => _productOrders[key])
            .sort((a, b) => b.quantity - a.quantity);

        if (productOrders.length > 7) {
            const orderProduct = {
                name: 'Sản phẩm khác',
                quantity: productOrders.reduce((prev, curr, index) => (index >= 6 ? prev + curr.quantity : prev), 0),
            };
            productOrders = productOrders.slice(0, 6);
            productOrders.push(orderProduct);
        }

        return {
            labels: productOrders.map((p) => p.name),
            datasets: [
                {
                    label: 'Số lượng',
                    data: productOrders.map((p) => p.quantity),
                    backgroundColor: productOrders.map((_, index) => COLORS[index]),
                    borderColor: '#888',
                    borderWidth: 1,
                },
            ],
        };
    }, [orderDetails, rangeDateValue.startDate, rangeDateValue.endDate]);

    return (
        <div className='container'>
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
            <div className='mt-3 flex'>
                <div className='flex-1 pr-4'>
                    <p className='text-center font-medium text-gray-700'>Sản phẩm được nhập hàng</p>
                    <div>
                        <div>{dataImport.datasets.length > 0 && <Pie data={dataImport} />}</div>
                    </div>
                </div>
                <div className='flex-1 pl-4'>
                    <p className='text-center font-medium text-gray-700'>Sản phẩm được bán</p>
                    <div>{dataOrder.datasets.length > 0 && <Pie data={dataOrder} />}</div>
                </div>
            </div>
        </div>
    );
}
