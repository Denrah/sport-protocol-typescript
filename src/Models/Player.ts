import {StorableWithID} from "../Services/DatabaseService";

const uuidv4 = require('uuid/v4');

export default class Player implements StorableWithID{
    public name: string;
    public uuid: string;

    constructor(name: string) {
        this.name = name;
        this.uuid = uuidv4();
    }
}