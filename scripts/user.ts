"use strict";

// IIFE (Immediately Invoked Function Expression) to create a core object if not already defined
// User class definition
export class User {

    private _displayName : string;
    private _emailAddress : string;
    private _userName : string;
    private _password : string;

    // Constructor initializes the user with default empty values for the properties
    constructor(displayName = "", emailAddress = "",
                userName = "", password = "") {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._userName = userName;
        this._password = password;
    }

    // Getter methods to access private properties
    get displayName() {
        return this._displayName;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    get userName() {
        return this._userName;
    }

    // Setter methods to modify private properties
    set displayName(displayName) {
        this._displayName = displayName;
    }

    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }

    set userName(userName) {
        this._userName = userName;
    }

    // toString method to return a string representation of the user
    toString() {
        return `Display Name: ${this._displayName}
        \nEmail Address: ${this._emailAddress}\nUsername: ${this._userName}`;
    }

    // Convert the user object to JSON format
    toJSON() : Record<string, string> {
        return {
            DisplayName: this._displayName,
            EmailAddress: this._emailAddress,
            UserName: this._userName,
            Password: this._password
        }
    }

    // Populate the user object from a JSON object
    fromJSON(data : { DisplayName : string, EmailAddress : string, UserName : string, Password: string}) {
        this._displayName = data.DisplayName;
        this._emailAddress = data.EmailAddress;
        this._userName = data.UserName;
        this._password = data.Password;
    }


    // Serialize user data into a string format (comma separated values)
    serialize() : string|null {
        if (this._displayName !== "" && this._emailAddress !== "" && this._userName !== "") {
            return `${this._displayName}, ${this._emailAddress}, ${this._userName}`;
        }
        console.error("[ERROR] Failed to serialize. One or more user properties are missing");
        return null;
    }

    // Deserialize data from a string (expects CSV format)
    deserialize(data : string) {
        let propertyArray = data.split(',');
        this._displayName = propertyArray[0];
        this._emailAddress = propertyArray[1];
        this._userName = propertyArray[2];
    }
}
