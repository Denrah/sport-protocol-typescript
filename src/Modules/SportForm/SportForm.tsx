import React, {ReactNode} from 'react';
import {HasDatabaseService} from "../../Utils/AppDependency";
import {Redirect} from 'react-router-dom';
import Sport from "../../Models/Sport";

type Dependencies = HasDatabaseService;

type Props = {
    dependencies: Dependencies
}

type State = {
    sportName?: string,
    redirect?: ReactNode
}

export default class SportForm extends React.Component<Props, State>{
    dependencies: Dependencies;

    constructor(props: Props) {
        super(props);
        this.dependencies = props.dependencies;
        this.state = {
            sportName: undefined,
            redirect: undefined,
        };
    }

    saveSport(): void {
        if (this.state.sportName !== undefined) {
            let sport = new Sport(this.state.sportName);
            this.dependencies.database.saveObject(sport, "sports");
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
                        <h1 className="mt-4">Создать вид спорта</h1>
                        <input type="text"
                               onChange={(event) => this.setState({sportName: event.target.value})}
                               placeholder="Название"
                               className="form-control mt-4"/>
                        <button className="btn btn-primary mt-4"
                                onClick={() => this.saveSport()}>Сохранить</button>
                    </div>
                </div>
            </div>
        );
    }
}