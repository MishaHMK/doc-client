import { createStore, createHook, Action } from 'react-sweet-state';
import { IPatient } from '../interfaces/IPatient';
import { IDoctor } from '../interfaces/IDoctor';
import axios from "axios";

type State = { roles: any, users: any, doctors: IDoctor[], patients: IPatient[], appointments:any[], 
               times: any, IsShown: any, doctorIdSelected: any, doctorId: any, patientId: any,
               currentRole: any};
type Actions = typeof actions;


const initialState: State = {
    users: [],
    roles: [],
    doctors: [],
    patients: [],
    appointments:[],
    times: [],
    IsShown: false,
    doctorIdSelected: '',
    doctorId: '',
    patientId: '',
    currentRole: ''
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

    getAllTimes: () : Action<State> => 
    async ({ setState, getState }) => {
        const times = await axios.get("https://localhost:44375/api/Account/times");
        setState({
          times: times.data
        });
    }, 

    getDoctors: () : Action<State> => 
    async ({ setState, getState }) => {
        const doctors = await axios.get("https://localhost:44375/api/Appointment/doctors");
        setState({
          doctors: doctors.data
        });
        console.log(doctors.data);
    }, 

    getPatients: () : Action<State> => 
    async ({ setState, getState }) => {
        const patients = await axios.get("https://localhost:44375/api/Appointment/patients");
        setState({
          patients: patients.data
        });
    }, 

    onLogIn: () : Action<State> => 
    async ({ setState, getState }) => {
        const patients = await axios.get("https://localhost:44375/api/Appointment/patients");
        setState({
          patients: patients.data
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
    },

    getAppointments: (doctorId: string, patientId: string, role: string) : Action<State> => 
    async ({ setState, getState }) => {
          const response = await axios.get("https://localhost:44375/api/Appointment/GetCalendarData/", { params: { 
            doctorId: doctorId,
            patientId: patientId, 
            role: role 
          }});
          console.log(response.data);
        setState({
          appointments: response.data
        });
    }
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useUserStore = createHook(Store);