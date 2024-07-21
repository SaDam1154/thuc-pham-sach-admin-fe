// Layouts
import FullLayout from '../layouts/FullLayout';

// Pages
import Home from '../pages/Home';
import ProductTypeList from '../pages/ProductType/ProductTypeList';
import Login from '../pages/Login';
import ProductList from '../pages/Product/ProductList';
import ProductDetail from '../pages/Product/ProductDetail';
import AddProduct from '../pages/Product/AddProduct';
import UpdateProduct from '../pages/Product/UpdateProduct';
import AddProductType from '../pages/ProductType/AddProductType';
import ProductTypeDetail from '../pages/ProductType/ProductTypeDetail';
import UpdateProductType from '../pages/ProductType/UpdateProductType';
import OrderList from '../pages/Order/OrderList';
import AddOrder from '../pages/Order/AddOrder';
import OrderDetail from '../pages/Order/OrderDetail';
import CustomerList from '../pages/Customer/CustomerList';
import CustomerDetail from '../pages/Customer/CustomerDetail';
import AddCustomer from '../pages/Customer/AddCustomer';
import UpdateCustomer from '../pages/Customer/UpdateCustomer';
import ImportList from '../pages/Import/ImportList';
import ImportDetail from '../pages/Import/ImportDetail';
import AddImport from '../pages/Import/AddImport';
import StatisticProduct from '../pages/Statistic/StatisticProduct';
import StatisticProfit from '../pages/Statistic/StatisticProfit';
import AddRole from '../pages/Role/AddRole';
import RoleList from '../pages/Role/RoleList';
import UpdateRole from '../pages/Role/UpdateRole';
import RoleDetail from '../pages/Role/RoleDetail';
import AccountList from '../pages/Account/AccountList';
import AddAccount from '../pages/Account/AddAccount';
import UpdateAccount from '../pages/Account/UpdateAccount';
import AccountDetail from '../pages/Account/AccountDetail';
import CouponList from '../pages/Coupon/CouponList';
import AddCoupon from '../pages/Coupon/AddCoupon';
import UpdateCoupon from '../pages/Coupon/UpdateCoupon';
import CouponDetail from '../pages/Coupon/CouponDetail';
import ConversationList from '../pages/Chat/ConversationList';
import VoucherList from '../pages/Voucher/VoucherList';
import AddVoucher from '../pages/Voucher/AddVoucher';
import VoucherDetail from '../pages/Voucher/VoucherDetail';
import AddPromotion from '../pages/Promotion/AddPromotion';
import PromotionList from '../pages/Promotion/PromotionList';
import PromotionDetail from '../pages/Promotion/PromotionDetail';

// Public routes
const publicRoutes = [
    {
        path: '/',
        component: Home,
        props: {
            heading: 'Trang chủ',
        },
    },

    // ORDER
    {
        path: '/order',
        component: OrderList,
        props: {
            heading: 'Danh sách hoá đơn',
        },
    },

    {
        path: '/order/add',
        component: AddOrder,
        props: {
            heading: 'Tạo hoá đơn',
        },
    },
    {
        path: '/order/detail/:id',
        component: OrderDetail,
        props: {
            heading: 'Chi tiết hoá đơn',
        },
    },

    // ORDER
    {
        path: '/import',
        component: ImportList,
        props: {
            heading: 'Danh sách phiếu nhập',
        },
    },
    {
        path: '/import/add',
        component: AddImport,
        props: {
            heading: 'Nhập sản phẩm',
        },
    },
    {
        path: '/import/detail/:id',
        component: ImportDetail,
        props: {
            heading: 'Chi tiết phiếu nhập',
        },
    },

    // PRODUCT
    {
        path: '/product',
        component: ProductList,
        props: {
            heading: 'Danh sách sản phẩm',
        },
    },
    {
        path: '/product/detail/:id',
        component: ProductDetail,
        props: {
            heading: 'Chi tiết sản phẩm',
        },
    },
    {
        path: '/product/add',
        component: AddProduct,
        props: {
            heading: 'Thêm sản phẩm',
        },
    },
    {
        path: '/product/update/:id',
        component: UpdateProduct,
        props: {
            heading: 'Chỉnh sửa sản phẩm',
        },
    },

    // PRODUCT TYPE
    {
        path: '/product-type',
        component: ProductTypeList,
        props: {
            heading: 'Danh sách loại sản phẩm',
        },
    },
    {
        path: '/product-type/add',
        component: AddProductType,
        props: {
            heading: 'Thêm loại sản phẩm',
        },
    },
    {
        path: '/product-type/detail/:id',
        component: ProductTypeDetail,
        props: {
            heading: 'Chi tiết loại sản phẩm',
        },
    },
    {
        path: '/product-type/update/:id',
        component: UpdateProductType,
        props: {
            heading: 'Chỉnh sửa loại sản phẩm',
        },
    },

    // Chat
    {
        path: '/chat',
        component: ConversationList,
        props: {
            heading: 'Danh sách hội thoại',
        },
    },
    // CUSTOMER
    {
        path: '/customer',
        component: CustomerList,
        props: {
            heading: 'Danh sách khách hàng',
        },
    },
    {
        path: '/customer/detail/:id',
        component: CustomerDetail,
        props: {
            heading: 'Chi tiết khách hàng',
        },
    },
    {
        path: '/customer/add',
        component: AddCustomer,
        props: {
            heading: 'Thêm khách hàng',
        },
    },
    {
        path: '/customer/update/:id',
        component: UpdateCustomer,
        props: {
            heading: 'Chỉnh sửa khách hàng',
        },
    },

    // Account
    {
        path: '/account',
        component: AccountList,
        props: {
            heading: 'Danh sách tài khoản',
        },
    },
    {
        path: '/account/add',
        component: AddAccount,
        props: {
            heading: 'Thêm tài khoản',
        },
    },
    {
        path: '/account/update/:id',
        component: UpdateAccount,
        props: {
            heading: 'Chỉnh sửa tài khoản',
        },
    },
    {
        path: '/account/detail/:id',
        component: AccountDetail,
        props: {
            heading: 'Chi tiết tài khoản',
        },
    },

    // Statistics
    {
        path: '/statistic/product',
        component: StatisticProduct,
        props: {
            heading: 'Thống kê sản phẩm',
        },
    },
    {
        path: '/statistic/profit',
        component: StatisticProfit,
        props: {
            heading: 'Thống kê doanh số',
        },
    },

    // ROLE
    {
        path: '/role',
        component: RoleList,
        props: {
            heading: 'Danh sách chức vụ',
        },
    },
    {
        path: '/role/add',
        component: AddRole,
        props: {
            heading: 'Thêm chức vụ',
        },
    },
    {
        path: '/role/detail/:id',
        component: RoleDetail,
        props: {
            heading: 'Chi tiết chức vụ',
        },
    },
    {
        path: '/role/update/:id',
        component: UpdateRole,
        props: {
            heading: 'Sửa chức vụ',
        },
    },

    // Coupon
    // {
    //     path: '/coupon',
    //     component: CouponList,
    //     props: {
    //         heading: 'Danh sách phiếu giảm giá',
    //     },
    // },
    // {
    //     path: '/coupon/add',
    //     component: AddCoupon,
    //     props: {
    //         heading: 'Thêm phiếu giảm giá',
    //     },
    // },
    // {
    //     path: '/coupon/update/:id',
    //     component: UpdateCoupon,
    //     props: {
    //         heading: 'Chỉnh sửa phiếu giảm giá',
    //     },
    // },
    // {
    //     path: '/coupon/detail/:id',
    //     component: CouponDetail,
    //     props: {
    //         heading: 'Chi tiết phiếu giảm giá',
    //     },
    // },

    // VOUCHER
    {
        path: '/voucher',
        component: VoucherList,
        props: {
            heading: 'Danh sách phiếu giảm giá',
        },
    },
    {
        path: '/voucher/add',
        component: AddVoucher,
        props: {
            heading: 'Thêm phiếu giảm giá',
        },
    },
    {
        path: '/voucher/detail/:id',
        component: VoucherDetail,
        props: {
            heading: 'Chi tiết phiếu giảm giá',
        },
    },

    // PROMOTION
    {
        path: '/promotion/add',
        component: AddPromotion,
        props: {
            heading: 'Thêm chương trình giảm giá',
        },
    },
    {
        path: '/promotion',
        component: PromotionList,
        props: {
            heading: 'Chương trình giảm giá',
        },
    },
    {
        path: '/promotion/detail/:id',
        component: PromotionDetail,
        props: {
            heading: 'Chi tiết chương trình',
        },
    },

    {
        path: '/login',
        layout: FullLayout,
        component: Login,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
