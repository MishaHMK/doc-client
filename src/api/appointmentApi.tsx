import axios from "axios";
import { IAppointment } from '../interfaces/IAppointment';

export default class AppointmentApi { 
  
  makeAppointment = async (Appointment: IAppointment) => {
    const response = await axios.post("https://localhost:44375/api/Appointment/save", Appointment);
    //window.location.reload();
    return response;
  };
}