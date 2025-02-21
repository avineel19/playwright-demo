// @ts-check
import { test, expect } from '@playwright/test';
import { sign } from 'crypto';
import { title } from 'process';
import { text } from 'stream/consumers';

test('Browser Context-Validating Error login', async({page}) =>{
    await page.goto("https://rahulshettyacademy.com/client");
    var email = "a.vineel@hotmail.com";
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("AAbb11!!");
    await page.locator("[value='Login']").click();
    const targetProductName = "zara";
    //wait for async method to wait for all text contents - you need to verify that all network calls are made
    //this is mainly service based architecture.
    await page.waitForLoadState('networkidle');
    // await page.locator(".card-body b").first().waitFor();
    const itemBody = page.locator(".card-body");
    console.log(await itemBody.locator("b").allTextContents());

    //Zara Coat 4
    const count = await itemBody.count();
    for(let i=0; i < count; i++) {
        if(await itemBody.nth(i).locator("b").textContent()===targetProductName) {
            //You can find element using text=<value of Text>
            await itemBody.nth(i).locator("text=Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    //Wait for this tag
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('zara')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();
    await page.locator("[placeholder='Select Country']").pressSequentially("King");
    const dropdown = page.locator(".ta-results");
    await page.locator(".ta-results").waitFor();
    const optionsCount = await dropdown.locator("button").count()

    for(let i=0; i<optionsCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if(text===' United Kingdom') {
            console.log("found united kingdom");
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    //Expect page location email address
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    //Enter all credit card info
    //credit card
    const fields = page.locator(".field");
    await page.locator(".field").first().waitFor();
    const totalCount = await fields.count();
    for(let i=0; i < totalCount; i++) {
        const titleName = await fields.nth(i).locator(".title").textContent();
        if(titleName === "Credit Card Number ") {
            fields.nth(i).locator(".input").fill("");
            fields.nth(i).locator(".input").fill("4542884193932293");
        } else if(titleName === "Expiry Date ") {
            const dateYear = fields.nth(i).locator("select");
            dateYear.first().selectOption("05");
            dateYear.last().selectOption("25");
        } else if(titleName === "CVV Code ?") {
            fields.nth(i).locator(".input").fill("567");
        } else if(titleName === "Name on Card ") {
            fields.nth(i).locator(".input").fill("V Amara");
        } 
    }
    await page.locator(".action__submit").click();
    
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    await expect(orderId).not.toBe(undefined);
    const refactoredOrderId = orderId?.replaceAll("|","").replaceAll(" ","");
    console.log(refactoredOrderId);
    await expect(refactoredOrderId).not.toBeNull();
    // await expect(refactoredOrderId).not.toBe(undefined);
    //view order
    await page.locator("button[routerLink*='myorders']").click();


    //
    await page.locator("tbody .ng-star-inserted").first().waitFor();
    const myOrders =  page.locator("tbody .ng-star-inserted");
    const myOrdersCount = await myOrders.count();

    for(let i=0; i<myOrdersCount; i++) {
        if(await myOrders.nth(i).locator("[scope='row']").textContent() === refactoredOrderId) {
            await myOrders.nth(i).locator("text=View").click();
            break;
        }
    }

    await page.locator(".tagline").waitFor();
    expect(page.locator(".tagline")).toHaveText("Thank you for Shopping With Us");

});