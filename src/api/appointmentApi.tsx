import axios, { AxiosError } from "axios";
import { ICreateMessage } from "../interfaces/ICreateMessage";

export default class AppointmentApi { 
    getMyAppointments = async (userId?: string, pageNumber?: number, pageSize?: number, currentRole?: string,
                                approved?: any, sort?: string, orderby?: string )  => {
        const response = await axios.get("https://localhost:44375/api/Appointment/pagedApps/" + userId, 
        { params: { 
            PageNumber: pageNumber,
            PageSize: pageSize,
            CurrentRole: currentRole,
            Approved: approved,
            Sort: sort,
            OrderBy: orderby
        }})
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          });

        console.log(response.data);
        return response;
    };

    getAppointmentsReport = async (userId?: string, startDate?: string, endDate?: string)  => {
            const response = await axios.get("https://localhost:44375/api/Appointment/GetReport/" + userId, 
            { params: { 
                    startDate: startDate,
                    endDate: endDate,
            }})
            .catch((error: AxiosError) => {
            throw new Error(error.message);
            });

            return response;
    };

    loadAppointmentsReport = async (userId?: string, startDate?: string, endDate?: string)  => {
        const response = await axios({
                url: "https://localhost:44375/api/Appointment/LoadReport/" + userId,
                method: 'GET',
                responseType: 'blob',
                params: { 
                  startDate: startDate,
                  endDate: endDate,
                }
              })
        .catch((error: AxiosError) => {
        throw new Error(error.message);
        });

        return response;
};
}