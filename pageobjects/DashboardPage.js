export class DashboardPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
    }
    async navigateToCart() {
        await this.cart.click();
    }

    async searchProduct(productName) {
        const itemBody = this.products;
        console.log(await this.productsText.allTextContents());

        //Zara Coat 4
        const count = await itemBody.count();
        for (let i = 0; i < count; i++) {
            if ((await itemBody.nth(i).locator("b").textContent()) === productName) {
                //You can find element using text=<value of Text>
                await itemBody.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }
}