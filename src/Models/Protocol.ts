import Sport from "./Sport";
import GameEvent from "./GameEvent";
import Team from "./Team";
const uuidv4 = require('uuid/v4');

export default class Protocol {
    uuid: string;
    sport: Sport;
    date: string;
    events: GameEvent[];
    firstTeam: Team;
    secondTeam: Team;

    constructor(sport: Sport, date: string, firstTeam: Team, secondTeam: Team, events = []) {
        this.sport = sport;
        this.date = date;
        this.firstTeam = firstTeam;
        this.secondTeam = secondTeam;
        this.events = events;
        this.uuid = uuidv4();
    }
}