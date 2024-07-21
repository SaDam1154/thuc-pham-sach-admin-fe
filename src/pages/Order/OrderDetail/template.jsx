// EmailTemplate.jsx
import React from 'react';
import PriceFormat from '../../../components/PriceFormat';

const EmailTemplate = ({ template }) => {
    return (
        <html lang='en'>
            <head>
                <meta charSet='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>Order Confirmation</title>
                <style>
                    {`
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .container-logo {
              display: flex;
              justify-content: center; 
              margin:auto;
              background-color: #ffffff;
              padding-top: 20px;
              padding-bottom: 5px;
              text-align: center;
              width: 600px;
              max-width: 600px;
            }
            .container-logo img 
            {
              max-width: 80px;
              margin-bottom: 10px;
            }
            .container-logo .info{
                text-align: left;
                margin-top: auto;
                margin-bottom: auto;
                padding-left: 5px;
            }
            .name{
              color: #16a34a;
              font-family: Arial, Helvetica, sans-serif; 
              font-weight: 700;
            }
            .container-logo .info .address{
              font-family: Arial, Helvetica, sans-serif; 
            }
            .header h1 {
              margin: 0;
            }
            .content {
              padding: 20px;
              padding-top: 0px;
            }
            .content h2 {
              color: #333333;
            }
            .content p {
              color: #555555;
            }
            .header {
                text-align: center;
                color: black;
            }
            .thanks {
                color: black;
                text-align: left;
                font-size: 16px;
                font-weight: 500;
            }
            .invoice-info {
              margin-top: 20px;
            }
            .invoice-info table {
              width: 100%;
              border-collapse: collapse;
            }
            .invoice-info th,
            .invoice-info td {
              padding: 10px;
              border: 1px solid #dddddd;
              text-align: left;
            }
            .invoice-info img {
              max-width: 50px;
              height: auto;
              display: block;
            }
            .invoice-info .total-row {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .invoice-info th {
              background-color: #f4f4f4;
            }
            .invoice-info .price-cell {
              text-align: right;
              color: #0073e6;
            }
            .invoice-info .highlight {
              background-color: #e6f7ff;
            }
            .invoice-info .totalPrice{
                    text-align: right;
                    color: #2563EB;
                    font-weight: 600;
            }
            .invoice-info .discountMoney{
                    text-align: right;
                    color: #FB5757;
                    font-weight: 500;
            }
            .invoice-info .intoMoney{
                    text-align: right;
                    color: #16A34A;
                    font-weight: 700;
            }
            .invoice-info .receivedMoney{
                    text-align: right;
                    color: #444444;
                    font-weight: 600;
            }
            .invoice-info .exchangeMoney{
                    text-align: right;
                    color: #444444;
                    font-weight: 500;
            }
            .footer {
              background-color: #f4f4f4;
              color: #555555;
              padding: 10px;
              text-align: center;
              font-size: 12px;
            }
            .footer a {
              color: #0073e6;
              text-decoration: none;
            }
            .boldText {
              font-weight: 700;
            }
          `}
                </style>
            </head>
            <body>
                <div className='container'>
                    <div className='container-logo'>
                        <img
                            src='https://res.cloudinary.com/dbxfq9usa/image/upload/v1719409903/thucphamsach/bjfomcnkbzuad9jugeg6.png'
                            alt='Logo'
                        />
                        <div className='info'>
                            <div className='name'>FreshFood Shop</div>
                            <div className='address'>Khu phố 6, P.Linh Trung, Tp.Thủ Đức</div>
                        </div>
                    </div>
                    <div className='header'>
                        <h1>
                            Đã cập nhật đơn hàng tại <span className='name'>FreshFood Shop</span>
                        </h1>
                    </div>
                    <div className='thanks'>
                        Chúng tôi đã cập nhật trạng thái đơn hàng của bạn. Hiện đơn hàng đang ở trạng thái{' '}
                        <span className='boldText'>"{template?.status}"</span>. Nếu có bất kỳ vấn đề gì, xin vui lòng liên hệ với chúng tôi
                        để được hỗ trợ.
                    </div>
                    <div className='thanks'>Dưới đây là thông tin về hóa đơn của bạn</div>
                    <div className='content'>
                        <h2>Thông tin khách hàng</h2>
                        <p>Tên khách hàng: {template?.order?.customer?.name}</p>
                        <p>Số điện thoại: {template?.order?.customer?.phone}</p>
                        <p>Địa chỉ giao hàng: {template?.order?.customer?.address}</p>

                        <div className='invoice-info'>
                            <h2>Thông tin hóa đơn</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Hình ảnh</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {template?.order.details.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product?.product.name}</td>
                                            <td>
                                                <img src={product?.product.images?.[0]} alt={product?.product.name} />
                                            </td>
                                            <td>{product?.quantity}</td>
                                            <td className='price-cell'>
                                                <PriceFormat>{product?.product.price}</PriceFormat> VND
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className='total-row highlight'>
                                        <th colSpan='3'>Tổng giá </th>
                                        <th className='totalPrice'>
                                            <PriceFormat>{template?.order?.totalPrice}</PriceFormat> VND
                                        </th>
                                    </tr>
                                    <tr className='total-row highlight'>
                                        <th colSpan='3'>Giảm giá </th>
                                        <th className='discountMoney'>
                                            <PriceFormat>{template?.order?.totalPrice - template?.order?.intoMoney}</PriceFormat> VND
                                        </th>
                                    </tr>
                                    <tr className='total-row highlight'>
                                        <th colSpan='3'>Thành tiền </th>
                                        <th className='intoMoney'>
                                            <PriceFormat>{template?.order?.intoMoney}</PriceFormat> VND
                                        </th>
                                    </tr>
                                    <tr className='total-row highlight'>
                                        <th colSpan='3'>Tiền nhận </th>
                                        <th className='receivedMoney'>
                                            <PriceFormat>{template?.order?.receivedMoney}</PriceFormat> VND
                                        </th>
                                    </tr>
                                    <tr className='total-row highlight'>
                                        <th colSpan='3'>Tiền thừa </th>
                                        <th className='exchangeMoney'>
                                            <PriceFormat>{template?.order?.exchangeMoney}</PriceFormat> VND
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='footer'>
                        <p>
                            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi tại
                            <a href='mailto:support@sadam01664@gmail.com'>sadam01664@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default EmailTemplate;
