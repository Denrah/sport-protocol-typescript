import {StorableWithID} from "../Services/DatabaseService";
import EventType from "./EventType";
import Player from "./Player";
const uuidv4 = require('uuid/v4');

export default class GameEvent implements StorableWithID{
    time: number;
    eventType: EventType;
    player1: Player;
    player2?: Player;
    uuid: string;

    constructor(time: number, eventType: EventType, player1: Player, player2?: Player) {
        this.time = time;
        this.eventType = eventType;
        this.player1 = player1;
        this.player2 = player2;
        this.uuid = uuidv4();
    }
}