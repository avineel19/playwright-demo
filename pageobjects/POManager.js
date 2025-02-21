import { LoginPage } from "./LoginPage";
import {CartPage} from "./CartPage";
import {DashboardPage} from "./DashboardPage";

class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashBoardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
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
}
export default()=>{POManager};