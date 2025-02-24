import { chromium } from "@playwright/test";
import {POManager} from "../../pageobjects/POManager.js";
import { Before,After, AfterStep, Status } from "@cucumber/cucumber";

Before(async function() {
    const browser = await chromium.launch({
        headless:false
    });
    this.page = await browser.newPage();
    this.poManager = new POManager(this.page);
})

After(function() {
    console.log("I am last to execute");
})
AfterStep(async function({result}) {
    if(result.status === Status.FAILED) {
        await this.page.screenshot({path:'screenshot.png'});
    }
})
