import Player from "./Player";
import {StorableWithID} from "../Services/DatabaseService";
const uuidv4 = require('uuid/v4');

export default class Team implements StorableWithID{
    public name: string;
    public uuid: string;
    public players: Player[];

    constructor(name: string, players: Player[] = []) {
        this.name = name;
        this.uuid = uuidv4();
        this.players = players;
    }
}