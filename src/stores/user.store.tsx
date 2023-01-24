import { createStore, createHook, Action } from 'react-sweet-state';
import { IRegister } from '../interfaces/IRegister';
import { ILogin } from '../interfaces/ILogin';
import { IDoctor } from '../interfaces/IDoctor';
import axios from "axios";
import AuthLocalStorage from "../AuthLocalStorage";

type State = { roles: any, users: any, doctors: IDoctor[], IsShown: any };
type Actions = typeof actions;


const initialState: State = {
    users: [],
    roles: [],
    doctors: [],
    IsShown: false
};

const actions = {
    getAllRoles: () : Action<State> => 
    async ({ setState, getState }) => {
        const roles = await axios.get("https://localhost:44375/api/Account/roles");
        console.log(roles);
        setState({
          roles: roles.data
        });
    }, 
    getDoctors: () : Action<State> => 
    async ({ setState, getState }) => {
        const doctors = await axios.get("https://localhost:44375/api/Appointment/doctors");
        console.log(doctors);
        setState({
          doctors: doctors.data
        });
    }, 

    makeModalVisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsShown: true,
      });
    },
  
    makeModalInvisible: (): Action<State> => async ({ setState }) => {
      setState({
        IsShown: false
      });
    }
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useUserStore = createHook(Store);