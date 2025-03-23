"use strict";

/*
Represent an event with a name, location, description, date, and time.
*/
class EventsPlanning {
    private _eventName: string;
    private _description: string;
    private _location: string;
    private _eventDate: string;  // New property for date
    private _eventTime: string;  // New property for time

    /**
     * Constructs a new event instance
     * @param eventName
     * @param location
     * @param description
     * @param eventDate
     * @param eventTime
     */
    constructor(eventName = "", location = "", description = "", eventDate = "", eventTime = "") {
        this._eventName = eventName;
        this._location = location;
        this._description = description;
        this._eventDate = eventDate;
        this._eventTime = eventTime;
    }

    /**
     * Gets the event name
     * @returns {string}
     */
    get eventName() {
        return this._eventName;
    }

    get eventDate(): string {
        return this._eventDate;
    }

    set eventDate(eventDate: string) {
        if (!eventDate) {
            throw new Error("Invalid date: Must be a non-empty string");
        }
        this._eventDate = eventDate;
    }

    get eventTime() {
        return this._eventTime;
    }

    set eventTime(eventTime: string) {
        this._eventTime = eventTime;
    }

    /**
     * Sets the event name. Validates input to ensure it's a non-empty string
     * @param eventName
     */
    set eventName(eventName: string) {
        if (eventName.trim() === "") {
            throw new Error("Invalid eventName: Must be a non-empty string");
        }
        this._eventName = eventName;
    }

    /**
     * Gets the event location
     * @returns {string}
     */
    get location() {
        return this._location;
    }

    /**
     * Sets the event location. Validates input to ensure it's a non-empty string
     * @param location
     */
    set location(location: string) {
        if (location.trim() === "") {
            throw new Error("Invalid location: Must be a non-empty string");
        }
        this._location = location;
    }

    /**
     * Gets the event description
     * @returns {string}
     */
    get description(): string {
        return this._description;
    }

    /**
     * Sets the event description. Validates input to ensure it's a non-empty string
     * @param description
     */
    set description(description: string) {
        if (description.trim() === "") {
            throw new Error("Invalid description: Must be a non-empty string");
        }
        this._description = description;
    }

    /**
     * Convert the event details into a human-readable string
     * @returns {string}
     */
    toString() {
        return `Event Name: ${this._eventName}\nLocation: ${this._location}\nDescription: ${this._description}\nDate: ${this._eventDate}\nTime: ${this._eventTime}`;
    }

    /**
     * Serializing the event details into a string format suitable for storage
     * @returns {string|null}
     */
    serialize() {
        if (!this._eventName || !this._location || !this._description || !this._eventDate || !this._eventTime) {
            console.error("One or more of the event properties are missing or invalid");
            return null;
        }
        return JSON.stringify({
            eventName: this._eventName,
            location: this._location,
            description: this._description,
            eventDate: this._eventDate,
            eventTime: this._eventTime
        });
    }

    /**
     * Deserialize the data and populate the event properties
     * @param data
     */
    deserialize(data: string) {
        try {
            const eventObj = JSON.parse(data);
            this._eventName = eventObj.eventName;
            this._location = eventObj.location;
            this._description = eventObj.description;
            this._eventDate = eventObj.eventDate;
            this._eventTime = eventObj.eventTime;
        } catch (error) {
            console.error("Invalid data format for deserializing data", error);
        }
    }
}
