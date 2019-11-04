import React, {ReactNode} from 'react';
import {HasDatabaseService} from "../../Utils/AppDependency";
import Player from "../../Models/Player";
import Team from "../../Models/Team";
import {Redirect} from 'react-router-dom';
import EventType from "../../Models/EventType";

type Dependencies = HasDatabaseService;

type Props = {
    dependencies: Dependencies
}

type State = {
    name?: string,
    redirect?: ReactNode,
}

export default class EventTypeForm extends React.Component<Props, State>{
    dependencies: Dependencies;

    constructor(props: Props) {
        super(props);
        this.dependencies = props.dependencies;
        this.state = {
            name: undefined,
        };
    }

    saveEventType() {
        if(this.state.name !== undefined) {
            let eventType = new EventType(this.state.name);

            this.dependencies.database.saveObject<EventType>(eventType, "eventTypes");
            this.setState({
                redirect: <Redirect to="/" />,
            });
        }
    }

    render(): React.ReactNode {
        return(
            <div className="container">
                {this.state.redirect}
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="mt-4">Создать тип события</h1>
                        <input type="text"
                               onChange={(event) => this.setState({name: event.target.value})}
                               placeholder="Название"
                               className="form-control mt-4"/>
                        <button className="btn btn-primary mt-4"
                                onClick={() => this.saveEventType()}>Сохранить</button>
                    </div>
                </div>
            </div>
        );
    }
}