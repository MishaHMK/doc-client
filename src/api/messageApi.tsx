import axios, { AxiosError } from "axios";

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

    getMessageThread = async (senderId?: string, receiverId?: string)  => {
       /* const response = await axios.get("https://localhost:44375/api/Messages/thread/" + senderId + "/" + receiverId)
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          }); */

       const response = await axios.get("https://localhost:44375/api/Messages/thread/Mykhailo/Robert%20Downey")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          }); 
          
        return response;
    };
}