import { test, request, expect } from '@playwright/test';



test.describe.configure({ mode: 'serial' });
let orderId, products, randomInt, accessToken, quantity;
let cartId, itemId, productId = 4875, productName = "2800 Watt Inverter Generator", productCategory = "bread-bakery";
test.use({ baseURL: 'https://simple-grocery-store-api.glitch.me' });

test.beforeAll(async ({ request }) => {
    console.log('Running authentication...'); // Logs only once per worker
    const response = await request.post('/api-clients', {
        data: {
            "clientName": "Vineel j",
            "clientEmail": `${generateRandomEmail()}`,
        },
    });
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    accessToken = await responseBody.accessToken;
    console.log("access token is " + accessToken);
});

test("Order Status", async ({ request }) => {

    try {
        const res = await request.get("/status", {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PostmanRuntime/7.43.0',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip,deflate,br',
                'Connection': 'keep-alive'
            }
        });
        expect(res.status()).toBe(200);
        const jsonResponse = await res.json();
        console.log(jsonResponse);

        console.log(jsonResponse.status);
    } catch (error) {
        console.error("Error during API request:", error);
    }
});

test("Get 20 Products and set Product details", async ({ request }) => {

    const res = await request.get("/products?results=20&inStock=true");
    expect(res.status()).toBe(200);
    products = await res.json();
    console.log(products);
    let size = products.length;
    console.log("size " + size);
    randomInt = Math.floor(Math.random() * size);
    console.log("randome Int is " + randomInt);
    productId = products[randomInt].id;
    productName = products[randomInt].name;
    productCategory = products[randomInt].category;
    console.log("productId selected : " + productId + " productName : " + productName + " productCategory : " + productCategory);

});

test("Get single product", async ({ request }) => {
    try {
        const jsonResponse = await getDetailedOrder(request);
        console.log("Message received for get single product <" + JSON.stringify(jsonResponse) + ">");
        expect(jsonResponse.id).toBe(productId);
        expect(jsonResponse.category).toBe(productCategory);
        expect(jsonResponse.name).toBe(productName)
    } catch (error) {
        console.error("Error while executing Get single Product", error);
    }
});

test("create a new cart", async ({ request }) => {
    await createNewCart(request);
});
test("Get Cart that was created", async ({ request }) => {
    expect(cartId).toBeDefined();
    const res = await request.get('/carts/' + cartId);
    expect(res.status()).toBe(200);
    const jsonResponse = await res.json();
    // const dateTimeCreated = await new Date(jsonResponse.created);
    // const expectedTime = await new Date();
    // console.log("created date time " + dateTimeCreated + "<current time is :" + expectedTime + ">");
    // expect(dateTimeCreated <= expectedTime).toBeTruthy();
    expect(jsonResponse.items.length).toBe(0);
});
test("Post Add Item to Cart", async ({ request }) => {
    await addItemToCart(request);
});
test("Update quantity of product in cart", async ({ request }) => {
    console.log("url is " + `/carts/${cartId}/items/${itemId}`);
    const res = await request.patch(`/carts/${cartId}/items/${itemId}`, {
        data: {
            "quantity": 2
        }
    })
    expect(res.status()).toBe(204);
});
test("put replace product in cart", async ({ request }) => {
    await updateItemToCart(request);
});
test("Delete current cart", async ({ request }) => {
    const res = await request.delete(`/carts/${cartId}/items/${itemId}`);
    expect((await res).status()).toBe(204);

    const getCartRequestForDeleted = await request.get(`/carts/${cartId}/items`);
    console.log("response of get response after delete " + JSON.stringify((await getCartRequestForDeleted).json()));
    expect((await getCartRequestForDeleted).status()).toBe(200);
    const responseInString = (await getCartRequestForDeleted).text();
    expect(await responseInString).toEqual("[]");
});

test("create new Cart again and Add item to cart", async ({ request }) => {
    console.log("Old cartId is " + cartId);
    await createNewCart(request);
    console.log("New cartId is " + cartId);
    await addItemToCart(request);
});

test("create an order", async ({ request }) => {
    const response = await request.post('/orders', {
        data: {
            "cartId": `${cartId}`,
            "customerName": 'Vineel j'
        }, headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    expect((await response).status()).toBe(201);
    const responseBody = await response.json();
    orderId = responseBody.orderId;
    expect(responseBody.created).toBeTruthy();
    expect(responseBody.orderId).toBeDefined();
});

test("Get All Orders", async ({ request }) => {
    const response = await request.get('/orders', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    expect((await response).status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody[0].id).toBe(orderId);
    expect(responseBody[0].items[0].id).toBe(itemId);
    expect(responseBody[0].items[0].productId).toBe(productId);
    expect(responseBody[0].items[0].quantity).toBe(1);
    expect(responseBody[0].customerName).toBe("Vineel j");
});

async function createNewCart(request) {
    const res = await request.post('/carts');
    expect(res.status()).toBe(201);
    const jsonResponse = await res.json();
    expect(jsonResponse.created).toBeTruthy();
    expect(jsonResponse.cartId).toBeDefined();
    cartId = jsonResponse.cartId;
    console.log("Created Cart ID is " + cartId);
}

async function updateItemToCart(request) {
    const currentRandomId = randomInt;
    const newValue = Math.floor(Math.random() * products.length);
    randomInt = (newValue !== randomInt) ? newValue : Math.floor(Math.random() * products.length);
    console.log("New random value is " + randomInt + " Old Value is : " + currentRandomId);
    productId = products[randomInt].id;
    console.log("new product Id is " + productId);
    const resDetailedOrder = await getDetailedOrder(request);
    quantity = resDetailedOrder['current-stock'];
    console.log("new product 'quantity' is " + quantity);
    const res = await request.put(`/carts/${cartId}/items/${itemId}`, {
        data: {
            "productId": productId,
            "quantity": quantity
        }
    });

    expect(res.status()).toBe(204);
}

async function addItemToCart(request) {

    const res = await request.post(`/carts/${cartId}/items`, {
        data: {
            "productId": productId
        }
    });
    expect(res.status()).toBe(201);

    const responseGet = await request.get(`/carts/${cartId}/items`);
    const jsonResponse = await responseGet.json();
    console.log("logger for post add item to cart " + JSON.stringify(jsonResponse));
    expect(jsonResponse[0].productId).toBe(productId);
    itemId = jsonResponse[0].id;
    expect(itemId).toBeDefined();
    console.log("ItemId is " + itemId);

}
function generateRandomEmail() {
    // Define possible characters for the username
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const usernameLength = 8; // Length of the username part
    const domainLength = 5; // Length of the domain part
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']; // List of common domains

    // Generate a random username
    let username = '';
    for (let i = 0; i < usernameLength; i++) {
        username += chars[Math.floor(Math.random() * chars.length)];
    }

    // Generate a random domain name
    let domain = '';
    for (let i = 0; i < domainLength; i++) {
        domain += chars[Math.floor(Math.random() * chars.length)];
    }

    // Choose a random domain from the list
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    // Combine username, domain, and top-level domain to form the email
    const email = `${username}@${domain}.${randomDomain.split('.')[1]}`;

    return email;
}

async function getDetailedOrder(request) {
    const res = await request.get("/products/" + productId);
    expect(res.status()).toBe(200);
    return await res.json();
}

