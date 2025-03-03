import { test as base } from '@playwright/test';

const customtest = base.extend({
  testDataForOrder: {
    username: "anshika@gmail.com",
    password: "Iamking@000",
    productName: "ADIDAS ORIGINAL"
  }
});

export { customtest };