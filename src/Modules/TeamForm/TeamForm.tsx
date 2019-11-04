import React, {ReactNode} from 'react';
import {HasDatabaseService} from "../../Utils/AppDependency";
import Player from "../../Models/Player";
import Team from "../../Models/Team";
import {Redirect} from 'react-router-dom';

type Dependencies = HasDatabaseService;

type Props = {
    dependencies: Dependencies
}

type State = {
    teamName?: string,
    players?: string,
    redirect?: ReactNode
}

export default class TeamForm extends React.Component<Props, State>{
    dependencies: Dependencies;

    constructor(props: Props) {
        super(props);
        this.dependencies = props.dependencies;
        this.state = {
            teamName: undefined,
            players: undefined,
            redirect: undefined,
        };
    }

    saveTeam(): void {
        if (this.state.players !== undefined && this.state.teamName !== undefined) {
            let players: Player[] = [];
            players = this.state.players.split(",").map((name): Player => new Player(name));
            let team = new Team(this.state.teamName, players);
            this.dependencies.database.saveObject(team, "teams");
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
                        <h1 className="mt-4">Создать команду</h1>
                        <input type="text"
                               onChange={(event) => this.setState({teamName: event.target.value})}
                               placeholder="Название"
                               className="form-control mt-4"/>
                        <input type="text"
                               onChange={(event) => this.setState({players: event.target.value})}
                               placeholder="Игроки (через запятую)"
                               className="form-control mt-4"/>
                         <button className="btn btn-primary mt-4"
                                 onClick={() => this.saveTeam()}>Сохранить</button>
                    </div>
                </div>
            </div>
        );
    }
}