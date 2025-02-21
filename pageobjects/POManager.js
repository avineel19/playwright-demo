const {LoginPage} = require('./LoginPage').default;
const{DashboardPage} = require('./DashboardPage').default;
const{CartPage} = require('./CartPage');

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
module.exports = {POManager};