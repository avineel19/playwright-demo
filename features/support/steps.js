import { exec } from "child_process";
import { When,Then,Given } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import {POManager} from "../../pageobjects/POManager.js";


Given('valid user login into application with {string} and {string}', {timeout: 100 * 1000}, async function (username, password) {
    // Write code here that turns the phrase above into concrete actions
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo();
    this.username = username;
    await loginPage.validLogin(username,password);
  });

  When('Add {string} to cart', async function (targetProductName) {
    // Write code here that turns the phrase above into concrete actions
    const dashBoardPage = this.poManager.getDashBoardPage();
    await dashBoardPage.searchProduct(targetProductName);
    await dashBoardPage.navigateToCart();
  });

  Then('Verify {string} is displayed in the cart', async function (targetProductName) {
    // Write code here that turns the phrase above into concrete actions
    this.cartPage = this.poManager.getCartPage();
    await this.cartPage.verifyProductIsDisplayed(targetProductName)
    await this.cartPage.checkout();
  });

  When('Enter valid details and placed the order', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.cartPage.selectCountry("King", ' United Kingdom');
    //Enter all credit card info
    //credit card
    await this.cartPage.enterCreditCardDetails(this.username);
    await this.cartPage.submitOrder();
  });

  Then('Verify order is present in the order-history', async function () {
    // Write code here that turns the phrase above into concrete actions
    const validateOrderDetailsPage = this.poManager.getValidateOrderDetailsPage();
    const orderId = await validateOrderDetailsPage.validateOrderPageExtractOrderId();
    // await expect(refactoredOrderId).not.toBe(undefined);
    //view order
    await validateOrderDetailsPage.clickMyOrders();

    const myordersPage = this.poManager.getMyOrdersPage();
    await myordersPage.findMyOrder(orderId);

    await myordersPage.viewOrderDetails();
  });