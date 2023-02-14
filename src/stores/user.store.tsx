import { createStore, createHook, Action } from 'react-sweet-state';
import { IPatient } from '../interfaces/IPatient';
import { IDoctor } from '../interfaces/IDoctor';
import axios from "axios";
import { IAppointment } from '../interfaces/IAppointment';

type State = { roles: any, users: any, doctors: IDoctor[], patients: IPatient[], appointments: any, 
               times: any, IsShown: any, doctorIdSelected: any, doctorId: any, patientId: any, currentUserId: any,
               currentRole: any, eventEditingOn: any, currentEventId: number, currentEventTitle: any, 
              currentEventDescription: any, currentEventPatientId: any, currentEventDoctorId: any,
              currentEventStartDate: any, currentEventTime: any, currentEventStatus: any, docSelected : any};
type Actions = typeof actions;


const initialState: State = {
    users: [],
    roles: [],
    doctors: [],
    patients: [],
    appointments:[],
    times: [],
    IsShown: false,
    docSelected:false,
    doctorIdSelected: '',
    doctorId: '',
    patientId: '',
    currentRole: '',
    currentUserId: '',
    eventEditingOn: false,
    currentEventId: 0,
    currentEventTitle: '',
    currentEventDescription: '',
    currentEventPatientId: '',
    currentEventDoctorId: '',
    currentEventStartDate: '',
    currentEventTime: '',
    currentEventStatus: false
};

const actions = {

    getAllRoles: () : Action<State> => 
    async ({ setState, getState }) => {
        const roles = await axios.get("https://localhost:44375/api/Account/roles");
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
        IsShown: true
      });
    },
  
    makeModalInvisible: (): Action<State> => async ({ setState }) => {
      setState({
        IsShown: false, 
        currentEventId: 0
      });
    },

    getAppointments: (doctorId: string, patientId: string, role: string) : Action<State> => 
    async ({ setState, getState }) => {
          const response = await axios.get("https://localhost:44375/api/Appointment/GetCalendarData/", { params: { 
            doctorId: doctorId,
            patientId: patientId, 
            role: role 
          }});
        setState({
          appointments: response.data
        });
    },

    getAppointment: (id: any) : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.get("https://localhost:44375/api/Appointment/GetCalendarDataById/" + id);
        setState({
          currentEventId: response.data.id,
          currentEventTitle: response.data.title,
          currentEventDescription: response.data.description,
          currentEventStartDate: response.data.startDate,
          currentEventTime: response.data.startDate,
          currentEventDoctorId: response.data.doctorId,
          currentEventPatientId: response.data.patientId,
          currentEventStatus: response.data.isApproved
        });
    },

    deleteAppointment: (id: any) : Action<State> => 
    ({ setState, getState }) => {
      if(window.confirm('Are you sure?')){
        axios.delete("https://localhost:44375/api/Appointment/Delete/" + id);
        const newList = getState().appointments.filter((app : any) => app.id != id);
        setState({
          appointments: newList
        });
      }
    },

    updateAppointment: (id: any, Appointment: any) : Action<State> =>
    async ({ setState, getState }) => {
      var appointment: any = { ...Appointment };
      const response = await axios.put("https://localhost:44375/api/Appointment/Edit/" + id, appointment);

      const updList = getState().appointments.map((app : any)=> {
        if(id === app.id){
           return appointment; }
        return app;
      })

      setState({appointments: updList });
      return response.data;
    }, 

    approveAppointment: (id: any, state: boolean) : Action<State> =>
    async ({ setState, getState }) => {
      const response = await axios.patch("https://localhost:44375/api/Appointment/Approve/" + id + "/" + !state); 
      const updList = getState().appointments.map((app : any)=> {
        if(id === app.id){
           return response.data; }
        return app;
      })
      setState({appointments: updList });
      return response.data;
    }, 


    createAppointment: (appToCreate: IAppointment) : Action<State> =>
    async ({ setState, getState }) => {
      const {data: newApp} = await axios.post("https://localhost:44375/api/Appointment/save", appToCreate);
      
      setState({
        appointments: [...getState().appointments, newApp]
      });

  }
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useUserStore = createHook(Store);