export class ValidationError extends Error {
    constructor(message, errorCode) {
      super(message); // Call the parent class constructor
      this.name = "ValidationError"; // Set the error name
      this.errorCode = errorCode; // Add a custom property
      this.timestamp = new Date(); // Add a timestamp
    }
  }
  