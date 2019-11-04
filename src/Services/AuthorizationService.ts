export default class AuthorizationService {
    authUser(password: string): boolean {
        if(password === "admin") {
            sessionStorage.setItem("isLogged", "true");
            return true;
        }
        return false;
    }

    isAuthorized(): boolean {
        let session = sessionStorage.getItem("isLogged");

        return session !== null;
    }
}