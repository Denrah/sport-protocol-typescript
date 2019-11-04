import React, {ReactNode} from 'react';
import {HasDatabaseService} from "../../Utils/AppDependency";
import {Redirect, RouteComponentProps} from 'react-router-dom';
import Sport from "../../Models/Sport";
import Protocol from "../../Models/Protocol";
import Team from "../../Models/Team";

type Dependencies = HasDatabaseService;

type Props = {
    dependencies: Dependencies,
}

type State = {
    sport?: Sport,
    protocolDate?: string,
    redirect?: ReactNode,
    teams: Team[],
    firstTeam?: string,
    secondTeam?: string,
}

interface RouteParams {
    sportId: string
}

export default class CreateProtocolForm extends React.Component<Props & RouteComponentProps<RouteParams>, State>{
    dependencies: Dependencies;

    constructor(props: Props & RouteComponentProps<RouteParams>) {
        super(props);
        this.dependencies = props.dependencies;
        this.state = {
            sport: undefined,
            protocolDate: undefined,
            redirect: undefined,
            teams: [],
        };
    }

    componentDidMount(): void {
        let { sportId } = this.props.match.params;
        if (sportId) {
            let sport = this.dependencies.database.getItemById<Sport>("sports", sportId);
            if(!sport) {
                this.setState({
                    redirect: <Redirect to="/"/>
                });
            }
            this.setState({
                sport: sport,
            });
        } else {
            this.setState({
                redirect: <Redirect to="/"/>
            });
        }

        let teams = this.dependencies.database.getCollection<Team>("teams");
        this.setState({
            teams: teams,
            firstTeam: teams[0].uuid,
            secondTeam: teams[0].uuid,
        });
    }

    saveProtocol(): void {
        if(this.state.protocolDate !== undefined &&
            this.state.sport !== undefined &&
            this.state.firstTeam !== undefined &&
            this.state.secondTeam !== undefined) {
            let firstTeam = this.state.teams.find(team => team.uuid === this.state.firstTeam);
            let secondTeam = this.state.teams.find(team => team.uuid === this.state.secondTeam);
            if(firstTeam !== undefined && secondTeam !== undefined) {
                let protocol = new Protocol(this.state.sport,
                    this.state.protocolDate,
                    firstTeam,
                    secondTeam);
                this.dependencies.database.saveObject(protocol, "protocols");
                this.setState({
                    redirect: <Redirect to="/"/>,
                });
            }
        }
    }

    render(): React.ReactNode {
        return(
            <div className="container">
                {this.state.redirect}
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="mt-4">Создать протокол</h1>
                        <h3>Для: { (this.state.sport) ? this.state.sport.name : null }</h3>
                        <input type="date"
                               onChange={(event) => this.setState({protocolDate: event.target.value})}
                               placeholder="Название"
                               className="form-control mt-4"/>
                        Первая команда:<br/>
                        <select className="form-control"
                                value={this.state.firstTeam}
                                onChange={event => this.setState({firstTeam: event.target.value})}>
                            {this.state.teams.map(team => {
                                return(
                                    <option value={team.uuid}>{team.name}</option>
                                );
                            })}
                        </select>
                        Вторая команда:<br/>
                        <select className="form-control"
                                value={this.state.secondTeam}
                                onChange={event => this.setState({secondTeam: event.target.value})}>
                            {this.state.teams.map(team => {
                                return(
                                    <option value={team.uuid}>{team.name}</option>
                                );
                            })}
                        </select>
                        <button className="btn btn-primary mt-4"
                                onClick={() => this.saveProtocol()}>Сохранить</button>
                    </div>
                </div>
            </div>
        );
    }
}