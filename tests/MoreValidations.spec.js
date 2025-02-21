import test, { expect } from "@playwright/test";

test("MoreValidations", async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    //how to handle java alert popups(dialoug)
    page.on('dialog',dialog=>dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    //handling frames & child frames it will be represented with tagname frameset or iframe
    const framesPage = page.frameLocator("#courses-iframe");
    //if you encounter with invisible element along with visible, you can filter with :visible value in css selector
    framesPage.locator("li a[href*='lifetime-access']:visible").click();
    await framesPage.locator(".text h2").textContent();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);



});