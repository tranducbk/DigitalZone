import Home from '../pages/Home/home';
import Product from '../pages/Product/ProductDetail';
import RegisterPage from '../pages/RegisterAccount';
import LoginPage from '../pages/Login';
import Admin from '../pages/AdminPage/AdminPage';
import userLayout from '../pages/userLayout/userLayout';
import adminLayout from '../pages/AdminPage/adminLayout';
import Category from '../pages/Category/Category'
import UserProfile from '../pages/UserProfile/UserProfile';
import CheckOrder from '../pages/CheckOrder/CheckOrder';
import Checkout from '../pages/Checkout/Checkout';
import Cart from '../pages/Cart/CartPage';

// public Routes

const publicRoutes=[
    {path: '/admin', component:Admin, layout: adminLayout},
    {path: '/', component: Home, layout: userLayout},
    {path: '/product', component: Product, layout: userLayout, childPath: ':productId'},
    {path: '/register', component:RegisterPage, layout: userLayout},
    {path: '/login', component:LoginPage, layout: userLayout},
    {path: '/điện thoại', component: Category, layout: userLayout, childPath: ':brandName', category: 'Điện thoại'},
    {path: '/bàn phím', component: Category, layout: userLayout, childPath: ':brandName', category: 'Bàn Phím'},
    {path: '/laptop', component: Category, layout: userLayout, childPath: ':brandName', category: 'Laptop'},
    {path: '/tivi', component: Category, layout: userLayout, childPath: ':brandName', category: 'TV'},
    {path: '/chuột', component: Category, layout: userLayout, childPath: ':brandName', category: 'Chuột'},
    {path: '/phụ kiện', component: Category, layout: userLayout, childPath: ':brandName', category: 'Phụ Kiện'},
    {path: '/tai nghe', component: Category, layout: userLayout, childPath: ':brandName', category: 'Tai Nghe'},
    {path: '/profile',component: UserProfile, layout: userLayout},
    {path: '/cart', component: Cart, layout: userLayout },
    {path: '/checkout', component: Checkout, layout: userLayout},
    {path: '/checkorder', component: CheckOrder, layout: userLayout},
];

const privateRoutes=[

];

export{
    publicRoutes, privateRoutes
}