import axios, { AxiosError } from "axios";
import { ICreateMessage } from "../interfaces/ICreateMessage";

export default class MessageApi { 
    getMessages = async (pageNumber?: number, pageSize?: number, container?: string, userId?: string)  => {
        const response = await axios.get("https://localhost:44375/api/Messages", { params: { 
            PageNumber: pageNumber,
            PageSize: pageSize,
            Container: container,
            userId: userId
        }})
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          });

        return response;
    };

    getMessageThread = async (senderName: string, receiverName: string)  => {
       const response = await axios.get("https://localhost:44375/api/Messages/thread/" + senderName + "/" + receiverName)
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          }); 

        return response;
    };

    sendMessage = async (createMessage: ICreateMessage)  => {
      const response = await axios.post("https://localhost:44375/api/Messages", createMessage)
       .catch((error: AxiosError) => {
           throw new Error(error.message);
         }); 

       return response;
   };


}