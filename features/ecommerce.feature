Feature: E-commerce validations
@flaky
    Scenario: Placing the order
    Given valid user login into application with "a.vineel@hotmail.com" and "AAbb11!!"
    When Add "ZARA COAT 4" to cart
    Then Verify "ZARA COAT 4" is displayed in the cart
    When Enter valid details and placed the order
    Then Verify order is present in the order-history