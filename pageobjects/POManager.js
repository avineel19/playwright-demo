import {LoginPage} from './LoginPage.js';
import {DashboardPage} from './DashboardPage.js';
import { CartPage } from './CartPage.js';
import { ValidateOrderDetails } from './ValidateOrderDetails.js';
import { MyOrdersPage } from './MyOrdersPage.js';

export class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashBoardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.validateOrderDetails = new ValidateOrderDetails(this.page);
        this.myOrdersPage = new MyOrdersPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashBoardPage() {
        return this.dashBoardPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getValidateOrderDetailsPage() {
        return this.validateOrderDetails;
    }

    getMyOrdersPage() {
        return this.myOrdersPage;
    }
}