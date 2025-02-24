// @ts-check
import { test, expect } from '@playwright/test';
import { sign } from 'crypto';
import { title } from 'process';
import { text } from 'stream/consumers';
import {POManager} from '../pageobjects/POManager';




test('Browser Context-Validating Error login', async({page}) =>{
    
    var email = "a.vineel@hotmail.com";
    const poManager = new POManager(page);
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
    await cartPage.verifyProductIsDisplayed(targetProductName)
    await cartPage.checkout();
    await cartPage.selectCountry("King", ' United Kingdom');
    
    
    //Enter all credit card info
    //credit card
    await cartPage.enterCreditCardDetails(email);
    await cartPage.submitOrder();
    
    const validateOrderDetailsPage = poManager.getValidateOrderDetailsPage();
    const orderId = await validateOrderDetailsPage.validateOrderPageExtractOrderId();
    // await expect(refactoredOrderId).not.toBe(undefined);
    //view order
    await validateOrderDetailsPage.clickMyOrders();

    const myordersPage = poManager.getMyOrdersPage();
    await myordersPage.findMyOrder(orderId);

    await myordersPage.viewOrderDetails();

});