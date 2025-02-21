import { test,expect,request } from "@playwright/test";
// import {APIUtils} from "./utils/APIUtils";
const {APIUtils} = require('./utils/APIUtils');


const loginPayload = {userEmail:"a.vineel@hotmail.com", userPassword:"AAbb11!!"};
const orderPayload = {
    orders: [
        {
            country: "United Kingdom",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]
};

let response;
test.beforeAll(async()=>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    // token = await apiUtils.getToken();
    response = await apiUtils.createOrder(orderPayload);
    
});

test("login Test", async({page})=>{

    page.addInitScript(value =>{
        window.localStorage.setItem('token',value)
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");
    const targetProductName = "zara";
    //wait for async method to wait for all text contents - you need to verify that all network calls are made
    //this is mainly service based architecture.
    await page.waitForLoadState('networkidle');
    // await page.locator(".card-body b").first().waitFor();
    const itemBody = page.locator(".card-body");
    console.log(await itemBody.locator("b").allTextContents());
});

test("createOrder via Api", async({page})=>{

    await page.addInitScript(value =>{
        window.localStorage.setItem('token',value)
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerLink*='myorders']").click();


    //
    await page.locator("tbody .ng-star-inserted").first().waitFor();
    const myOrders =  page.locator("tbody .ng-star-inserted");
    const myOrdersCount = await myOrders.count();

    for(let i=0; i<myOrdersCount; i++) {
        if(await myOrders.nth(i).locator("[scope='row']").textContent() === response.orderId) {
            await myOrders.nth(i).locator("text=View").click();
            break;
        }
    }

    await page.locator(".tagline").waitFor();
    expect(page.locator(".tagline")).toHaveText("Thank you for Shopping With Us");
});