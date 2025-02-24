import { expect } from "@playwright/test";

export class ValidateOrderDetails {
    constructor(page) {
        this.page = page;
        this.thanksForOrderBanner = this.page.locator(".hero-primary");
        this.orderId = this.page.locator(".em-spacer-1 .ng-star-inserted");
        this.myOrdersLink = this.page.locator("button[routerLink*='myorders']");
    }

    async validateOrderPageExtractOrderId() {
        await expect(this.thanksForOrderBanner).toHaveText(" Thankyou for the order. ");
        const orderNum = await this.orderId.textContent();
        await expect(orderNum).not.toBe(undefined);
        const refactoredOrderId = orderNum?.replaceAll("|", "").replaceAll(" ", "");
        console.log(refactoredOrderId);
        await expect(refactoredOrderId).not.toBeNull();
        return refactoredOrderId;
    }

    async clickMyOrders() {
        //view order
        await this.myOrdersLink.click();
    }

}