import { createStore, createHook, Action } from 'react-sweet-state';
import { IPatient } from '../interfaces/IPatient';
import { IDoctor } from '../interfaces/IDoctor';
import axios, { AxiosError } from "axios";
import { IAppointment } from '../interfaces/IAppointment';
import PaginatedResult from '../models/pagination';
import { IMessage } from '../interfaces/IMessage';


type State = { roles: any, users: any, specs: any, doctors: IDoctor[], patients: IPatient[], appointments: any, 
               times: any, IsAppShown: any, IsThreadShown: any, doctorIdSelected: any, doctorId: any, doctorName: any,  
               patientId: any, currentUserId: any, currentUserName: any,  currentUserIntroduction: any,
               currentRole: any, eventEditingOn: any, currentUserSpeciality: any, paginatedUsers: PaginatedResult,
               currentEventId: number, currentEventTitle: any, currentEventDescription: any, currentName: any,
               currentEventPatientId: any, currentEventDoctorId: any, currentEventStartDate: any,
               currentEventTime: any, currentEventStatus: any, docSelected : any, docPageOn: any
               messages: IMessage[], paginatedMessages: PaginatedResult, senderName: string, receiverName: string, 
               datePicker: any};
type Actions = typeof actions;


const initialState: State = {
    roles: [],
    users: [],
    messages: [],
    specs: ["Any",
            "Pediatrics",
            "Neurology",
            "Cardiology",
            "Radiology"],
    doctors: [],
    patients: [],
    appointments:[],
    times: [],
    IsAppShown: false,
    IsThreadShown: false,
    docSelected:false,
    doctorIdSelected: '',
    doctorId: '',
    datePicker: '',
    doctorName: '',
    patientId: '',
    currentRole: '',
    currentName: '',
    currentUserId: '',
    currentUserName: '',
    currentUserIntroduction: '',
    currentUserSpeciality: '',
    eventEditingOn: false,
    currentEventId: 0,
    currentEventTitle: '',
    currentEventDescription: '',
    currentEventPatientId: '',
    currentEventDoctorId: '',
    currentEventStartDate: '',
    currentEventTime: '',
    currentEventStatus: false,
    senderName: '',
    receiverName: '',
    docPageOn: false,
    paginatedUsers: {
      pagedList: [],
      currentPage: 1,
      totalItems: 0,
      pageSize: 4,
    },
    paginatedMessages: {
      pagedList: [],
      currentPage: 1,
      totalItems: 0,
      pageSize: 4,
    }
};

const actions = {
    getAllRoles: () : Action<State> => 
    async ({ setState, getState }) => {
        const roles = await axios.get("https://localhost:44375/api/Account/roles");
        setState({
          roles: roles.data
        });
        console.log(roles.data);
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

    makeAppModalVisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsAppShown: true
      });
    },
  
    makeAppModalInvisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsAppShown: false, 
        currentEventId: 0
      });
    },


    makeThreadModalVisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsThreadShown: true
      });
    },
  
    makeThreadModalInvisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsThreadShown: false
      });
    },

    setSenderName: (send_un: string): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        senderName: send_un
      });
    },

    setReceiverName: (rec_un: string): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        receiverName: rec_un
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

    getAllUsers: () : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.get("https://localhost:44375/api/Account/users");
        setState({
          users: response.data
        });
    },

    getAppointment: (id: any) : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.get("https://localhost:44375/api/Appointment/GetCalendarDataById/" + id);
        console.log(response.data);
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

    getUserById: (id: any) : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.get("https://localhost:44375/api/Account/users/" + id);
        setState({
          currentUserId: response.data.id,
          currentUserName: response.data.name,
          currentUserIntroduction: response.data.introduction,
          currentUserSpeciality: response.data.speciality
        });

        return response.data;
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

    updateUser: (id: any, UserForm: any) : Action<State> =>
    async ({ setState, getState }) => {
      var form: any = { ...UserForm };
      const response = await axios.put("https://localhost:44375/api/Account/Edit/" + id, form);

      const updList = getState().users.map((app : any)=> {
        if(id === app.id){
           return form; }
        return app;
      })

      setState({users: updList });
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