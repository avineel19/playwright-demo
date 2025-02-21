// @ts-check
import { test, expect } from '@playwright/test';
import { sign } from 'crypto';

test('First Test', async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise")
});

test('Chrome Browser Test', async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
});

test('Login - Fill Form', async({page})=>{
    const userName = page.locator('#username');
    const passwordTextbox = page.locator("[type='password']");
    const tossMsg = page.locator("[style*='block']");
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    console.log(await page.title());
    //css type(depricated) fill enter wrong username
    await userName.fill("rahulshettacademy");
    //css type password
    await passwordTextbox.fill("learning");
    await signIn.click();
    //Handling Blink or Toss messages that appear after 2 sec - 
    // how to user explicit wait in playwrite
    //playwrite can handle this scenario using locator, no need to implement await unitl method like selenium
    //locator method will handle this scenario it wait untill value given in palywright.config.js timeout:30*1000 ie 30sec
    //DOM
    console.log(await tossMsg.textContent());
    await expect(tossMsg).toContainText("Incorrect");
    //clear content in textbox send empty string
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    //now wait for next page and select first product

    console.log(await cardTitles.nth(0).textContent());
    console.log(await cardTitles.first().textContent());
    //There are chances playwight may think list can be empty if page is slow, 30 sec wait won't work.
    console.log(await cardTitles.allTextContents());

});

// test.beforeAll('Before all ', async({page})=>{
//     const userName = page.locator('#username');
//     const passwordTextbox = page.locator("[type='password']");
//     const tossMsg = page.locator("[style*='block']");
//     const signIn = page.locator("#signInBtn");
//     const cardTitles = page.locator(".card-body a");
//     await page.goto("https://rahulshettyacademy.com/loginpagePractise");
//     console.log(await page.title());
//     //css type(depricated) fill enter wrong username
//     await userName.fill("rahulshettacademy");
//     //css type password
//     await passwordTextbox.fill("learning");
//     await signIn.click();
// });

test('UI Controls', async({page})=>{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    const userName = page.locator('#username');
    const passwordTextbox = page.locator("[type='password']");
    const dropwon = page.locator("select.form-control");
    const signIn = page.locator("#signInBtn");
    const terms = page.locator("#terms");
    const documentLink = page.locator("[href*='documents-request']");
    await dropwon.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect( page.locator(".radiotextsty").last()).toBeChecked();

    await terms.click();
    await expect(terms).toBeChecked();
    await terms.uncheck();
    //await should be outside - where action is performed
    expect(await terms.isChecked()).toBeFalsy();
    

    //Blinking link
    await expect(documentLink).toHaveAttribute("class", "blinkingText");



    await page.pause();
});

test('@Child page handling', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    const documentLink = page.locator("[href*='documents-request']");

    // const pagePromise = context.waitForEvent('page');
    // await documentLink.click();
    // const newPage = await pagePromise;
    

    //both below steps should be fulfilled - use Promise.all()
    const [newPage] = await Promise.all(
        [
    context.waitForEvent('page'),//listen for any new page pending, rejected, fulfilled
    documentLink.click()

    ])
    //In above Promise, first line will be in pending status and in parallel second line will be executed, 
    // both of them will be executed simultaniously untill both of promises are fulfilled
    const text = await newPage.locator(".red").textContent();
    console.log(text);
    const arrayText = text?.split("@");
    if(arrayText!= undefined) {
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await page.locator('#username').fill(domain);
    await page.pause();
    console.log(await page.locator("#username").textContent());
    }
});
