import axios, { AxiosError } from "axios";
import { ICreateReview } from "../interfaces/ICreateReview";

export default class ReviewApi { 
    getPagedReviews = async (userId?: string | null, pageNumber?: number, pageSize?:number)  => 
    {
      const response = await axios.get("https://localhost:44375/api/Review/pagedReviews/" + userId, 
      { params: { 
          PageNumber: pageNumber,
          PageSize: pageSize,
      }})
      .catch((error: AxiosError) => {
        throw new Error(error.message);
      });

      return response;
    };


    getReviewById = async (id: number)  => {
        const response =  await axios.get("https://localhost:44375/api/Review/" + id)
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          }); 

        return response;
   };

    createReview = async (createReview: ICreateReview)  => {
      //const response =
       await axios.post("https://localhost:44375/api/Review/create", createReview)
       .catch((error: AxiosError) => {
           throw new Error(error.message);
         }); 

       //return response;
   };

    editReview = async (id: any, Review: any)  => {
        const response = await axios.post("https://localhost:44375/api/Review/Edit" + id, Review)
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response.data;
   };

   deleteMessage = async (id: number)  => {
      await axios.delete("https://localhost:44375/Review/Delete/" + id)
      .catch((error: AxiosError) => {
          throw new Error(error.message);
        }); 
   };
}