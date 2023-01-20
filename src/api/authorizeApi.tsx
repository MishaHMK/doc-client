import AuthLocalStorage from "../AuthLocalStorage";
import axios from "axios";
import { ILogin } from '../interfaces/ILogin';

export default class AuthorizeApi { 

    static isSignedIn(): boolean {
        return !!AuthLocalStorage.getToken();
    }

    login = async (userToLogin: ILogin) => {
        const response = await axios.post("https://localhost:44375/api/Account/authenticate", userToLogin)
          .then((response) => {
            if (response.data.token !== null) {
              AuthLocalStorage.setToken(response.data.token);
            }
          });

        return response;
      };
    
    logout = () => {
        AuthLocalStorage.removeToken();
      };
}