import AuthLocalStorage from "../AuthLocalStorage";
import { ILogin } from '../interfaces/ILogin';
import { IRegister } from '../interfaces/IRegister';
import Api from "./api";

export default class AuthorizeApi { 

   /* constructor(private presenceService: PresenceService){

    } */

    static isSignedIn(): boolean {
        return !!AuthLocalStorage.getToken();
    }

    login = async (userToLogin: ILogin) => {
        const response = await Api.post("Account/authenticate", userToLogin)
          .then((response) => {
            if (response.data.tokenString !== null) {
              AuthLocalStorage.setToken(response.data.tokenString);
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
               throw new Error(error.message);
            } 
          });

        return response;
      };

    register = async (registerForm: IRegister) => {
        const response = await Api.post("Account/register", registerForm);
        return response;
      };

    logout = () => {
        AuthLocalStorage.removeToken();
      };
}