import Sport from "../Models/Sport";
import {HasDatabaseService} from "./AppDependency";
import EventType from "../Models/EventType";
import Player from "../Models/Player";
import Team from "../Models/Team";

type Dependencies = HasDatabaseService;

export default class DefaultDataSeeder {
    static seedDefaults(dependencies: Dependencies): void {
        let isFirstLaunch = localStorage.getItem("isFirstLaunch");

        if (isFirstLaunch !== null) {
            return;
        }

        ["Футбол", "Баскетбол"].map(item => {
            let sport = new Sport(item);
            dependencies.database.saveObject<Sport>(sport, "sports");
        });

        ["Гол", "Пас", "Бросок", "Фол", "Карточка"].map(item => {
            let eventType = new EventType(item);
            dependencies.database.saveObject<Sport>(eventType, "eventTypes");
        });

        let players = [new Player("Иванов"), new Player("Сидоров")];
        let team = new Team("Солнышки", players);
        dependencies.database.saveObject<Team>(team, "teams");

        players = [new Player("Петров"), new Player("Соколов")];
        team = new Team("Зайчики", players);
        dependencies.database.saveObject<Team>(team, "teams");

        localStorage.setItem("isFirstLaunch", "false");
    }
}