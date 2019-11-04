import React, {ReactNode} from 'react';
import {HasAuthorizationService, HasDatabaseService} from "../../Utils/AppDependency";
import {Redirect, RouteComponentProps} from 'react-router-dom';
import Sport from "../../Models/Sport";
import Protocol from "../../Models/Protocol";
import GameEvent from "../../Models/GameEvent";
import EventType from "../../Models/EventType";
import EventsMatrix from "../../Components/EventsMatrix";

type Dependencies = HasDatabaseService & HasAuthorizationService;

type Props = {
    dependencies: Dependencies,
}

type State = {
    protocol?: Protocol,
    redirect?: ReactNode,
    time?: number,
    firstPlayer?: string,
    secondPlayer?: string,
    eventTypes: EventType[],
    eventType?: string,
}

interface RouteParams {
    protocolId: string,
}

export default class CreateProtocolForm extends React.Component<Props & RouteComponentProps<RouteParams>, State>{
    dependencies: Dependencies;
    eventsMatrixRef: React.RefObject<EventsMatrix>;

    constructor(props: Props & RouteComponentProps<RouteParams>) {
        super(props);
        this.dependencies = props.dependencies;
        this.state = {
            protocol: undefined,
            redirect: undefined,
            time: undefined,
            firstPlayer: undefined,
            secondPlayer: undefined,
            eventTypes: [],
            eventType: undefined,
        };

        this.eventsMatrixRef = React.createRef<EventsMatrix>();
    }

    componentDidMount(): void {
        this.loadProtocol();
        let eventTypes = this.dependencies.database.getCollection<EventType>("eventTypes");
        this.setState({
            eventTypes: eventTypes,
            eventType: eventTypes[0].uuid,
        });
    }

    saveEvent(): void {
        if(this.state.protocol === undefined || this.state.eventType === undefined)
            return;

        let time = this.state.time;
        let firstPlayer = this.state.protocol.firstTeam.players.concat(this.state.protocol.secondTeam.players)
            .find(player => player.uuid === this.state.firstPlayer);
        let secondPlayer = this.state.protocol.firstTeam.players.concat(this.state.protocol.secondTeam.players)
            .find(player => player.uuid === this.state.secondPlayer);

        let eventType = this.dependencies.database.getItemById<EventType>("eventTypes", this.state.eventType);

        if(firstPlayer !== undefined && time !== undefined && eventType !== undefined) {
            let event = new GameEvent(time, eventType, firstPlayer, secondPlayer);
            let protocol = this.state.protocol;
            protocol.events.push(event);
            this.dependencies.database.updateItemById("protocols", protocol.uuid, protocol);
            this.loadProtocol();
        }
    }

    loadProtocol(): void {
        let { protocolId } = this.props.match.params;
        if (protocolId) {
            let protocol = this.dependencies.database.getItemById<Protocol>("protocols", protocolId);
            if(!protocol) {
                this.setState({
                    redirect: <Redirect to="/"/>
                });
            }
            this.setState({
                protocol: protocol,
            });

            if (this.eventsMatrixRef.current !== null) {
                this.eventsMatrixRef.current.loadStatistic();
            }
        } else {
            this.setState({
                redirect: <Redirect to="/"/>
            });
        }
    }

    render(): React.ReactNode {
        if(this.state.protocol === undefined) {
            return (<span>Загрузка</span>);
        }
        return(
            <div className="container">
                {this.state.redirect}
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="mt-4">
                            {
                                this.state.protocol.date + " - " +  this.state.protocol.sport.name
                            }
                        </h1>
                        <h3>
                            {
                                this.state.protocol.firstTeam.name + " vs " +  this.state.protocol.secondTeam.name
                            }
                        </h3>
                        <strong className="mt-4">События:</strong><br/>
                        <table className="table">
                            <tr>
                                <th>Время</th>
                                <th>Игрок 1</th>
                                <th>Игрок 2</th>
                                <th>Тип события</th>
                            </tr>
                            {
                                this.state.protocol.events.map(event => {
                                    return(
                                        <tr key={event.uuid}>
                                            <td>{event.time}</td>
                                            <td>{event.player1.name}</td>
                                            <td>{(event.player2) ? event.player2.name : "-"}</td>
                                            <td>{event.eventType.name}</td>
                                        </tr>
                                    );
                                })
                            }
                        </table>
                        <hr/>
                        {
                            (this.dependencies.authService.isAuthorized()) ?
                                <div>
                                    <strong>Добавить событие</strong>
                                    <div className="form-inline">
                                        <input type="text"
                                               className="form-control"
                                               placeholder="Время (минуты)"
                                               onChange={event => this.setState({time: Number(event.target.value)})}/>
                                        <select value={this.state.firstPlayer}
                                                onChange={event => this.setState({firstPlayer: event.target.value})}
                                                className="form-control ml-1">
                                            <option selected disabled>Игрок 1</option>
                                            <optgroup label={this.state.protocol.firstTeam.name}>
                                                {
                                                    this.state.protocol.firstTeam.players.map(player => {
                                                        return(
                                                            <option value={player.uuid}>{player.name}</option>
                                                        );
                                                    })
                                                }
                                            </optgroup>
                                            <optgroup label={this.state.protocol.secondTeam.name}>
                                                {
                                                    this.state.protocol.secondTeam.players.map(player => {
                                                        return(
                                                            <option value={player.uuid}>{player.name}</option>
                                                        );
                                                    })
                                                }
                                            </optgroup>
                                        </select>
                                        <select value={this.state.secondPlayer}
                                                onChange={event => this.setState({secondPlayer: event.target.value})}
                                                className="form-control ml-1">
                                            <option selected disabled>Игрок 2</option>
                                            <option value={undefined}>-</option>
                                            <optgroup label={this.state.protocol.firstTeam.name}>
                                                {
                                                    this.state.protocol.firstTeam.players.map(player => {
                                                        return(
                                                            <option value={player.uuid}>{player.name}</option>
                                                        );
                                                    })
                                                }
                                            </optgroup>
                                            <optgroup label={this.state.protocol.secondTeam.name}>
                                                {
                                                    this.state.protocol.secondTeam.players.map(player => {
                                                        return(
                                                            <option value={player.uuid}>{player.name}</option>
                                                        );
                                                    })
                                                }
                                            </optgroup>
                                        </select>
                                        <select value={this.state.eventType}
                                                onChange={event => this.setState({eventType: event.target.value})}
                                                className="form-control ml-1">
                                            {
                                                this.state.eventTypes.map(eventType => {
                                                    return(
                                                        <option value={eventType.uuid}>{eventType.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                        <button onClick={() => this.saveEvent()} className="btn btn-primary ml-1">Добавить</button>
                                    </div>
                                </div> :
                                null
                        }
                        <hr/>
                        <h2>Статистика</h2>
                        <div><strong>Всего событий:</strong> {this.state.protocol.events.length}</div>
                        <div><strong>Время первого события:</strong>&nbsp;
                            {this.state.protocol.events.sort((a, b) => a.time < b.time ? -1 : 1)[0].time}
                        </div>
                        <div><strong>Первое событие:</strong>&nbsp;
                            {this.state.protocol.events.sort((a, b) => a.time < b.time ? -1 : 1)[0].eventType.name}
                        </div>
                        <div><strong>Время последнего события:</strong>&nbsp;
                            {this.state.protocol.events.sort((a, b) => a.time > b.time ? -1 : 1)[0].time}
                        </div>
                        <div><strong>Последнее событие:</strong>&nbsp;
                            {this.state.protocol.events.sort((a, b) => a.time > b.time ? -1 : 1)[0].eventType.name}
                        </div>
                        <strong>Матрица событий</strong>
                        <EventsMatrix ref={this.eventsMatrixRef} protocol={this.state.protocol}/>
                    </div>
                </div>
            </div>
        );
    }
}