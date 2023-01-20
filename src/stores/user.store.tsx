import { createStore, createHook, Action } from 'react-sweet-state';
import { IRegister } from '../interfaces/IRegister';
import { ILogin } from '../interfaces/ILogin';
import axios from "axios";
import AuthLocalStorage from "../AuthLocalStorage";

type State = { roles: any, users: any, currentUser: any };
type Actions = typeof actions;


const initialState: State = {
    users: [],
    roles: [],
    currentUser: []
};

const actions = {
    loginUser: (userToLogin: ILogin) : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.post("https://localhost:44375/api/Account/authenticate", userToLogin) 
        .then((response) => {
          if (response.data.token !== null) {
            AuthLocalStorage.setToken(response.data.token);
          }
        })
        return response;
    }, 
    registerUser: (registerForm: IRegister) : Action<State> => 
    async ({ setState, getState }) => {
        const {data: form} = await axios.post("https://localhost:44375/api/Account/register", registerForm);
        setState({
          users: [...getState().users, form]
        });
    }, 
    getAllRoles: () : Action<State> => 
    async ({ setState, getState }) => {
        const roles = await axios.get("https://localhost:44375/api/Account/roles");
        console.log(roles);
        setState({
          roles: roles.data
        });
    }, 
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useUserStore = createHook(Store);