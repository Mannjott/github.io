"use strict";

/*
Represent a contact with a name, contact number and email address.
*
*/

export class Contact {

    private _fullName: string;
    private _contactNumber: string;
    private _emailAddress: string;

    /**
     * Constructs a new contact instance
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     */

    constructor(fullName : string = "", contactNumber : string = "", emailAddress : string = "") {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }

    /**
     * Gets the full name of the contact
     * @returns {string}
     */
    get fullName() : string {
        return this._fullName;
    }

    /**
     * set the full name of the contact. validates input to ensure it's a non-empty string
     * @param fullName
     */
    set fullName(fullName : string) {
        if (fullName.trim() === "") {

            throw new Error("Invalid fullName:Must be non-empty string");
        }


        this._fullName = fullName;
    }

    /**
     * Gets the contact number of the contact
     * @returns {string}
     */
    get contactNumber() : string {
        return this._contactNumber;
    }

    /**
     * Set the contact number of the contact. Validates input to ensure it matches 10 digit format.
     * @param contactNumber
     */
    set contactNumber(contactNumber : string) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; //905-555-5555
        if (!phoneRegex.test(contactNumber)) {

            throw new Error("Invalid Contact number: Must be a 10-digit number");
        }
        this._contactNumber = contactNumber;
    }

    /**
     * Get the email address for contact
     * @returns {string}
     */
    get emailAddress() : string {
        return this._emailAddress;
    }

    /**
     * sets the email address of the contact. Validate input to ensure a standard email format
     * @param address
     */
    set emailAddress(address : string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email format
        if (!emailRegex.test(address)) {
            throw new Error("Invalid email address: Must be non-empty string");
        }
        this._emailAddress = address;
    }

    /**
     * Convert the contact details into a human-readable string
     * @returns {string}
     */
    toString() : string {
        return `Full Name: ${this._fullName}\n,
                Contact Number: ${this._contactNumber}\n,
                Email: ${this._emailAddress} `;
    }

    /**
     * Serializing the contact details into a string format suitable for storage
     * @returns {string|null}
     */
    serialize() :string|null {
        if (!this._fullName || !this._contactNumber || !this._emailAddress) {
            console.error("One or more of the contact properties are missing or invalid")
            return null;
        }
        return `${this._fullName},${this._contactNumber}, ${this._emailAddress}`;
    }

    /**
     * Deserializing a string (comma-delimited) of contact details and update properties.
     * @param data
     */
    deserialize(data : string) {
        if (data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }

        const proArray = data.split(",");
        this._fullName = proArray[0];
        this._contactNumber = proArray[1];
        this._emailAddress = proArray[2];
    }

}



