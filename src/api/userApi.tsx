import axios from "axios";

export default class UserApi { 

    getById = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44375/api/User/" + id);
      
        return response;
      };
}