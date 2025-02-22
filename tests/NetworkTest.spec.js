import { test,expect,request } from "@playwright/test";

// import {APIUtils} from "./utils/APIUtils";
import { APIUtils } from '../utils/APIUtils';


const loginPayload = {userEmail:"a.vineel@hotmail.com", userPassword:"AAbb11!!"};
const orderPayloadOrders = {
    orders: [
        {
            country: "United Kingdom",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]
};
const fakePayLoadOrders = {data:[], message:"No Orders"};

let response;
test.beforeAll(async()=>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    // token = await apiUtils.getToken();
    response = await apiUtils.createOrder(orderPayloadOrders);
    
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

test.only("createOrder via Api", async({page})=>{

    await page.addInitScript(value =>{
        window.localStorage.setItem('token',value)
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");
    //route=> is a asyncronus function
    const pageUrl = "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*";
    await page.route(pageUrl,async route=>{
        const resonse = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayLoadOrders);
        route.fulfill({
            response,
            body
        });
        //intercepting response - API response->{fake response}->browser
        //can get page Request context disposed.  that mean api response may be delayed, to avoid use await for response method
    })
    await page.locator("button[routerLink*='myorders']").click();
    //Wait for response to avoid request context disposed exception
    await page.waitForResponse(pageUrl)
    console.log(await page.locator(".mt-4").textContent())
    //
    await page.loc
    ator("tbody .ng-star-inserted").first().waitFor();
    const myOrders =  page.locator("tbody .ng-star-inserted");
    const myOrdersCount = await myOrders.count();

    for(let i=0; i<myOrdersCount; i++) {
        if((await myOrders.nth(i).locator("[scope='row']").textContent()) === response.orderId) {
            await myOrders.nth(i).locator("text=View").click();
            break;
        }
    }

    await page.locator(".tagline").waitFor();
    expect(page.locator(".tagline")).toHaveText("Thank you for Shopping With Us");
});