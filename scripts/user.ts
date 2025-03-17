"use strict";


export class User {

    private _displayName : string;
    private _emailAddress : string;
    private _userName : string;
    private _password : string;

    constructor(displayName : string = "", emailAddress : string = "",
                userName : string = "", password : string = "") {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._userName = userName;
        this._password = password;
    }

    get displayName() : string {
        return this._displayName;
    }

    get emailAddress() :string {
        return this._emailAddress;
    }

    get userName() : string {
        return this._userName;
    }

    set displayName(displayName : string) {
        this._displayName = displayName;
    }

    set emailAddress(emailAddress : string) {
        this._emailAddress = emailAddress;
    }

    set userName(userName : string) {
        this._userName = userName;
    }

    toString() : string {
        return `Display Name: ${this._displayName}
            \nEmail Address: ${this._emailAddress}\nUsername: ${this._userName}`;
    }

    toJSON() : Record<string, string> {
        return {
            DisplayName: this._displayName,
            EmailAddress: this._emailAddress,
            UserName: this._userName,
            Password: this._password
        }
    }

    fromJSON(data : { DisplayName : string, EmailAddress : string, UserName : string, Password: string}) {
        this._displayName = data.DisplayName;
        this._emailAddress = data.EmailAddress;
        this._userName = data.UserName;
        this._password = data.Password;
    }

    serialize() : string|null {
        if (this._displayName !== "" && this._emailAddress !== "" && this._userName !== "") {
            return `${this._displayName}, ${this._emailAddress}, ${this._userName}`;
        }
        console.error("[ERROR] Failed to serialize. One or more user properties are missing");
        return null;
    }

    deserialize(data : string) {
        let propertyArray = data.split(',');
        this._displayName = propertyArray[0];
        this._emailAddress = propertyArray[1];
        this._userName = propertyArray[2];
    }
}
