// @ts-check
import { test, expect } from '@playwright/test';
import { sign } from 'crypto';
import { title } from 'process';
import { text } from 'stream/consumers';
import POManager from '../pageobjects/POManager';




test('Browser Context-Validating Error login', async({page}) =>{
    
    var email = "a.vineel@hotmail.com";
    const poManager = new POManager(page)
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(email,"AAbb11!!");

    const targetProductName = "ZARA COAT 3";
    //wait for async method to wait for all text contents - you need to verify that all network calls are made
    //this is mainly service based architecture.
    // await page.waitForLoadState('networkidle');
    // await page.locator(".card-body b").first().waitFor();
    const dashBoardPage = poManager.getDashBoardPage();
    await dashBoardPage.searchProduct(targetProductName);
    await dashBoardPage.navigateToCart();
    
    const cartPage = poManager.getCartPage();
    await cartPage.selectCountry("King", ' United Kingdom');
    //Expect page location email address
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    //Enter all credit card info
    //credit card
    cartPage.enterCreditCardDetails();
    
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