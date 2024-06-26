import axios, { AxiosError } from "axios";

export default class UserApi { 

    getById = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44375/api/User/" + id);
      
        return response;
    };

    getPagedUsers = async (pageNumber?: number, pageSize?:number, searchName?:string, speciality?:string, sort?: string, orderby?: string)  => 
    {
      const response = await axios.get("https://localhost:44375/api/Account/pagedDocs", { params: { 
          PageNumber: pageNumber,
          PageSize: pageSize,
          SearchName: searchName,
          Speciality: speciality,
          Sort: sort,
          OrderBy: orderby
      }})
      .catch((error: AxiosError) => {
        throw new Error(error.message);
      });

      return response;
  };

  confirmEmail = async (userId?: any, token ?:any)  => 
  {
    console.log(userId);


    //const response = await axios.get("https://localhost:44375/api/Account/confirmEmail?userId=" + {userId} + "&token=" + {token})
    const response = await axios.get("https://localhost:44375/api/Account/confirmEmail", { params: { 
      userId: userId,
      token: token
  }})
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });

    console.log(response.data.succeeded);

    return response;
}
}