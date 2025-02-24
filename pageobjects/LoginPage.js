import POManager from "./POManager";

class LoginPage {
    constructor(page) {
        const pom = new POManager(page);
        this.page = page;
        this.signInButton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }
    async validLogin(username, password) {
        await this.userName.type(username);
        await this.password.type(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

export default LoginPage;