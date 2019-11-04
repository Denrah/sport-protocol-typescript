import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import TeamForm from "./Modules/TeamForm/TeamForm";
import AppDependency from "./Utils/AppDependency";
import MainScreen from "./Modules/MainScreen/MainScreen";
import SportForm from "./Modules/SportForm/SportForm";
import CreateProtocolForm from "./Modules/Protocol/CreateProtocolForm";
import ProtocolScreen from "./Modules/Protocol/ProtocolScreen";
import EventTypeForm from "./Modules/EventsTypeForm/EventTypeForm";
import DefaultDataSeeder from "./Utils/DefaultDataSeeder";


export default class App extends React.Component{
  appDependency: AppDependency;

  constructor() {
    super({});
    this.appDependency = AppDependency.makeDefaultDependencies();
    DefaultDataSeeder.seedDefaults(this.appDependency);
  }

  render(): React.ReactNode {
    return (
        <div className="App">
          <Router>
            {
              (this.appDependency.authService.isAuthorized()) ?
                  <Switch>
                    <Route path="/addTeam">
                      <TeamForm dependencies={this.appDependency}/>
                    </Route>
                    <Route path="/addSport">
                      <SportForm dependencies={this.appDependency}/>
                    </Route>
                    <Route path="/addEventType">
                      <EventTypeForm dependencies={this.appDependency}/>
                    </Route>
                    <Route path="/protocols/create/:sportId" render={props => <CreateProtocolForm {...props} dependencies={this.appDependency}/> }/>
                    <Route path="/protocols/:protocolId" render={props => <ProtocolScreen {...props} dependencies={this.appDependency}/>}/>
                    <Route path="/">
                      <MainScreen dependencies={this.appDependency}/>
                    </Route>
                  </Switch> :
                  <Switch>
                    <Route path="/protocols/:protocolId" render={props => <ProtocolScreen {...props} dependencies={this.appDependency}/>}/>
                    <Route path="/">
                      <MainScreen dependencies={this.appDependency}/>
                    </Route>
                  </Switch>
            }
          </Router>
        </div>
    );
  }
};

