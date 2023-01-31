import axios from "axios";
import { IAppointment } from '../interfaces/IAppointment';

export default class AppointmentApi { 
  
  makeAppointment = async (Appointment: IAppointment) => {
    const response = await axios.post("https://localhost:44375/api/Appointment/save", Appointment);
    //window.location.reload();
    return response;
  };

  updateAppointment = async (id: any, Appointment: IAppointment) => {
    var app: IAppointment = { ...Appointment };
    const response = await axios.put("https://localhost:44375/api/Appointment/Edit/" + id, app);
    //window.location.reload();
    return response.data;
  };
}