import DatabaseService from "../Services/DatabaseService";
import AuthorizationService from "../Services/AuthorizationService";

export interface HasDatabaseService {
    database: DatabaseService;
}

export interface HasAuthorizationService {
    authService: AuthorizationService;
}

export default class AppDependency implements HasDatabaseService, HasAuthorizationService{
    database: DatabaseService;
    authService: AuthorizationService;

    constructor(database: DatabaseService, authService: AuthorizationService) {
        this.database = database;
        this.authService = authService;
    }

    static makeDefaultDependencies(): AppDependency {
        let database = new DatabaseService();
        let authService = new AuthorizationService();

        return new AppDependency(database, authService);
    }
}