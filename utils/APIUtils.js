export class APIUtils {
    constructor(apiContext,loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }
    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",{data:this.loginPayload});
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        console.log("toke {"+token+"}");
        return token;
    }
    async createOrder(orderPayload) {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
            {
                data : orderPayload,
                headers : {
                    'Authorization' : response.token,
                    'Content-Type' : 'application/json'
                }
            });
        const orderResponseJson = await orderResponse.json();
        console.log("Order response ",orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        console.log("Order Id is: ", orderId);
        response.orderId = orderId;
        return response;
        
    }
}