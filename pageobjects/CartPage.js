import { expect } from "@playwright/test";
class CartPage {
    #waitTag;
    #hasProductText;
    #checkout;
    constructor(page) {
        this.page = page;
        this.#waitTag = this.page.locator("div li");
        this.#hasProductText = this.page.locator("h3:has-text('zara')");
        this.#checkout = this.page.locator("text=Checkout");
        this.country = this.page.locator("[placeholder='Select Country']");
        this.dropDownCountrys = this.page.locator(".ta-results");
        this.fields = this.page.locator(".field");
        this.submit = this.page.locator(".action__submit")

    }

    async selectCountry(sequencialKeysCountry, countryToSelect) {
        //Wait for this tag
        await this.#waitTag.first().waitFor();
        const bool = await this.#hasProductText.isVisible();
        expect(bool).toBeTruthy();

        await this.#checkout.click();
        await this.country.pressSequentially(sequencialKeysCountry);
        const dropdown = this.dropDownCountrys;
        await dropdown.waitFor();
        const optionsCount = await dropdown.locator("button").count()

        for (let i = 0; i < optionsCount; i++) {
            const text = await dropdown.locator("button").nth(i).textContent();
            if (text === countryToSelect) {
                console.log("found united kingdom");
                await dropdown.locator("button").nth(i).click();
                break;
            }
        }
    }

    async enterCreditCardDetails() {
        //Enter all credit card info
    //credit card
    
    await this.fields.first().waitFor();
    const totalCount = await this.fields.count();
    for(let i=0; i < totalCount; i++) {
        const titleName = await this.fields.nth(i).locator(".title").textContent();
        if(titleName === "Credit Card Number ") {
            this.fields.nth(i).locator(".input").fill("");
            this.fields.nth(i).locator(".input").fill("4542884193932293");
        } else if(titleName === "Expiry Date ") {
            const dateYear = this.fields.nth(i).locator("select");
            dateYear.first().selectOption("05");
            dateYear.last().selectOption("25");
        } else if(titleName === "CVV Code ?") {
            this.fields.nth(i).locator(".input").fill("567");
        } else if(titleName === "Name on Card ") {
            this.fields.nth(i).locator(".input").fill("V Amara");
        } 
    }
    await this.submit.click();
    }
}
export default() => {CartPage};