import React from 'react';
import {HasAuthorizationService, HasDatabaseService} from "../../Utils/AppDependency";
import Team from "../../Models/Team";
import Sport from "../../Models/Sport";
import Protocol from "../../Models/Protocol";
import EventType from "../../Models/EventType";

type Dependencies = HasDatabaseService & HasAuthorizationService;

type Props = {
    dependencies: Dependencies
}

type State = {
    teams: Team[],
    sports: Sport[],
    protocols: Protocol[],
    eventTypes: EventType[],
}

export default class MainScreen extends React.Component<Props, State> {
    dependencies: Dependencies;

    constructor(props: Props) {
        super(props);
        this.dependencies = props.dependencies;
        this.state = {
            teams: [],
            sports: [],
            protocols: [],
            eventTypes: [],
        };
    }

    componentDidMount(): void {
        let teams = this.dependencies.database.getCollection<Team>("teams");
        let sports = this.dependencies.database.getCollection<Team>("sports");
        let protocols = this.dependencies.database.getCollection<Protocol>("protocols");
        let eventTypes = this.dependencies.database.getCollection<EventType>("eventTypes");
        this.setState({
            teams: teams,
            sports: sports,
            protocols: protocols,
            eventTypes: eventTypes,
        });
    }

    authenticate(): void {
        let password = prompt("Пароль");

        if(password === null)
            return;

        if(this.dependencies.authService.authUser(password)) {
            window.location.reload();
        } else {
            alert("Неверный пароль!");
        }
    }

    render(): React.ReactNode {
        return (
            <div className="container">
                <div className="row">
                    {
                        (!this.dependencies.authService.isAuthorized()) ?
                            <div className="col-md-12">
                                <button className="btn btn-primary mt-4" onClick={this.authenticate.bind(this)}>Войти</button>
                            </div> : null
                    }
                    <div className="col-md-12">
                        <h1 className="mt-4">Виды спорта</h1>
                        {
                            (this.dependencies.authService.isAuthorized()) ?
                                <a className="btn btn-primary mb-4" href="/addSport">Создать</a> : null
                        }
                        <ul className="list-group">
                            {this.state.sports.map(sport => {
                                return (
                                    <li key={sport.uuid} className="list-group-item d-flex justify-content-between">
                                        {sport.name}
                                        {
                                            (this.dependencies.authService.isAuthorized()) ?
                                                <a className="btn btn-primary" href={"/protocols/create/" + sport.uuid}>Создать протокол</a> : null
                                        }
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <h1 className="mt-4">Протоколы</h1>
                        <ul className="list-group">
                            {this.state.protocols.map(protocol => {
                                return (
                                    <li key={protocol.uuid} className="list-group-item d-flex justify-content-between">
                                        {protocol.date} - {protocol.sport.name}
                                        <a className="btn btn-primary" href={"/protocols/" + protocol.uuid}>Просмотр</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <h1 className="mt-4">Команды</h1>
                        {
                            (this.dependencies.authService.isAuthorized()) ?
                                <a className="btn btn-primary mb-4" href="/addTeam">Создать</a> : null
                        }
                        <ul className="list-group">
                            {this.state.teams.map(team => {
                                return (
                                    <li key={team.uuid} className="list-group-item">
                                        <strong>{team.name}</strong>
                                        <br/>
                                        Игроки:&nbsp;
                                        {team.players.map(player => {
                                            return (
                                                <span key={player.uuid}>{player.name},</span>
                                            );
                                        })}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <h1 className="mt-4">Типы событий</h1>
                        {
                            (this.dependencies.authService.isAuthorized()) ?
                                <a className="btn btn-primary mb-4" href="/addEventType">Создать</a> : null
                        }
                        <ul className="list-group mb-4">
                            {this.state.eventTypes.map(eventType => {
                                return (
                                    <li key={eventType.uuid} className="list-group-item">
                                        {eventType.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}