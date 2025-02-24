export class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInButton = this.page.locator("[value='Login']");
        this.userName = this.page.locator("#userEmail");
        this.password = this.page.locator("#userPassword");
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