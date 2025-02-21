import { test, expect } from '@playwright/test';

test('Playwright special locators', async({page})=>{
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Male");
    //getByLabel for edit boxes works only when there is an for relation between lable and edit box 
    // or else edit tag should be inside label tag called association.
    await page.getByPlaceholder("Password").fill("Password1234");
    await page.getByRole("button",{name:'Submit'}).click();
    await page.getByText("Sucess! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name: "Shop"}).click();
    //wait for next page to load
    await page.locator("app-card").first().waitFor();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();

});