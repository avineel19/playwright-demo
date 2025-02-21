import { test, expect } from '@playwright/test';

test("Calendar Test", async({page})=>{
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__calendar-button__icon").click();
    await page.locator(".react-calendar__navigation__label__labelText").click();
    await page.locator(".react-calendar__navigation__label__labelText").click();

    //This give you year to select
    const year = "2027";
    const month = "6";
    const day = "15";

    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month)-1).click();
    await page.locator("//abbr[text()='"+day+"']").click();
    const dateToValidate = year+"-"+month.padStart(2,'0')+"-"+day;

    expect(await page.locator(".react-date-picker__inputGroup [type='date']").getAttribute("value")).toBe(dateToValidate);

});