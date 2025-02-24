import { expect } from "@playwright/test";
export class MyOrdersPage {
    constructor(page) {
        this.page = page;
        this.myOrdersLocator = this.page.locator("tbody .ng-star-inserted");
        this.tagLine = this.page.locator(".tagline");
    }

    async findMyOrder(orderId) {
        await this.myOrdersLocator.first().waitFor();
        const myOrders = this.myOrdersLocator;
        const myOrdersCount = await myOrders.count();

        for (let i = 0; i < myOrdersCount; i++) {
            if ((await myOrders.nth(i).locator("[scope='row']").textContent()) === orderId) {
                await myOrders.nth(i).locator("text=View").click();
                break;
            }
        }
    }

    async viewOrderDetails() {
        await this.tagLine.waitFor();
        expect(this.tagLine).toHaveText("Thank you for Shopping With Us");
    }
}