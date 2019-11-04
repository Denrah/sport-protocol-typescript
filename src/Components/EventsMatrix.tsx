import React, {ReactNode} from 'react';
import Protocol from "../Models/Protocol";
import EventType from "../Models/EventType";

type Props = {
    protocol: Protocol,
};

type State = {
    statistic?: Map<string, Map<string, Map<string, string>>>;
    eventTypes: EventType[],
};

export default class EventsMatrix extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            statistic: undefined,
            eventTypes: [],
        }
    }

    public loadStatistic(): void {
        let events = this.props.protocol.events;

        let statistic = new Map();

        events.map(event => {
            if (!statistic.has(event.player1.uuid)) {
                let playerInfo = new Map();
                playerInfo.set("name", event.player1.name);
                statistic.set(event.player1.uuid, playerInfo);
            }

            let playerInfo = statistic.get(event.player1.uuid);

            if(this.state.eventTypes.find(x => x.uuid === event.eventType.uuid) === undefined) {
                let eventTypes = this.state.eventTypes;
                eventTypes.push(event.eventType);
                this.setState({
                    eventTypes: eventTypes
                });
            }

            if (!playerInfo.has(event.eventType.uuid)) {
                let eventInfo = new Map();
                eventInfo.set("name", event.eventType.name);
                eventInfo.set("count", 1);
                playerInfo.set(event.eventType.uuid, eventInfo);
            } else {
                let eventInfo = playerInfo.get(event.eventType.uuid);
                eventInfo.set("count", eventInfo.get("count") + 1);
                playerInfo.set(event.eventType.uuid, eventInfo);
            }

            statistic.set(event.player1.uuid, playerInfo);

            if (event.player2 !== undefined) {
                if (!statistic.has(event.player2.uuid)) {
                    let playerInfo = new Map();
                    playerInfo.set("name", event.player2.name);
                    statistic.set(event.player2.uuid, playerInfo);
                }

                let playerInfo = statistic.get(event.player2.uuid);

                if(this.state.eventTypes.find(x => x.uuid === event.eventType.uuid) === undefined) {
                    let eventTypes = this.state.eventTypes;
                    eventTypes.push(event.eventType);
                    this.setState({
                        eventTypes: eventTypes
                    });
                }

                if (!playerInfo.has(event.eventType.uuid)) {
                    let eventInfo = new Map();
                    eventInfo.set("name", event.eventType.name);
                    eventInfo.set("count", 1);
                    playerInfo.set(event.eventType.uuid, eventInfo);
                } else {
                    let eventInfo = playerInfo.get(event.eventType.uuid);
                    eventInfo.set("count", eventInfo.get("count") + 1);
                    playerInfo.set(event.eventType.uuid, eventInfo);
                }

                statistic.set(event.player2.uuid, playerInfo);
             }
        });

        console.log(statistic);
        this.setState({
            statistic: statistic,
        });
    }

    componentDidMount(): void {
        this.loadStatistic();
    }

    render() {
        if(this.state.statistic === undefined) {
            return <span>Загрузка...</span>
        }

        return (
            <table className="table">
                <th>Игрок</th>
                {
                    this.state.eventTypes.map(eventType => {
                        return <th>{eventType.name}</th>;
                    })
                }
                {Array.from(this.state.statistic.values()).map(item => {
                    return(
                        <tr>
                            <td>
                                {item.get("name")}
                            </td>
                            {
                                this.state.eventTypes.map(eventType => {
                                    if(item.has(eventType.uuid)) {
                                        let eventInfo = item.get(eventType.uuid);
                                        if (eventInfo !== undefined) {
                                            return (
                                                <td>{eventInfo.get("count")}</td>
                                            );
                                        }
                                    }
                                    return <td>-</td>;
                                })
                            }
                        </tr>
                    );
                })}
            </table>
        );
    }
}