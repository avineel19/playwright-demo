import { test,expect } from "@playwright/test";
import  ExcelJs from "exceljs";
// const ExcelJs = require('exceljs');

async function excelReadTest(path, valueToRead, valueToChange, change) {


    const workbook = ExcelJs.Workbook();
    
    let output = { row: -1, column: -1 };
    await workbook.xlsx.readFile(path);

    const worksheet = workbook.getWorksheet('Sheet1');
    readExcelTest(worksheet, valueToRead, output);
    output.column +=change.column;
    output.row += change.row;
    await writeExcelTest(worksheet, workbook, valueToChange,output, path);
}

async function writeExcelTest(worksheet, workbook, newValue, output, path) {
    console.log("row <" + output.row+ + "> column <" + output.column + ">");
    const cell = worksheet.getCell(Number(output.row), Number(output.column));
    cell.value = newValue;
    await workbook.xlsx.writeFile(path);
}

async function readExcelTest(worksheet, valueToRead, output) {

    
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, collNumber) => {
            if (cell.value === valueToRead) {
                console.log("Result is "+valueToRead+" found in cell Number " + collNumber + " row number is " + rowNumber);
                output.row = rowNumber;
                output.column = collNumber;

            }
        });
    });
    console.log("row <" + output.row + "> column <" + output.column + ">");
}


test.only('Upload download excel validation', async({page})=>{
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const valueToSearch = "Mango";
    const updatedValue = 350;
    //to wait for download, we need to create a waitForEvent'download' and then later use await downloadPromise.
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', {name:'Download'}).click();
    const download = await downloadPromise;
    await download.saveAs('/Users/VINEEL/Downloads/' + download.suggestedFilename());
    excelReadTest("/Users/VINEEL/Downloads/download.xlsx",valueToSearch,updatedValue,{row:0,column:2});
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles("/Users/VINEEL/Downloads/download.xlsx");
    //Validate value is update correctly
    const textLocator = page.getByText(valueToSearch);
    const rowLocator = await page.getByRole('row').filter({has:textLocator});

    await expect(rowLocator.locator("#cell-4-undefined")).toContainText(updatedValue.toString());

});