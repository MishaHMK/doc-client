import {useEffect} from "react"
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Rate } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { ICreateReview } from '../interfaces/ICreateReview';
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import ReviewApi from "../api/reviewApi";

export const ReviewModal: React.FC = () => { 

    let reviewService = new ReviewApi();

    const [reviewForm] = useForm();
    const [state, actions] = useUserStore();
    const [dateTimeChoice, setDateTime] = useState(" ");

    const token = AuthLocalStorage.getToken() as string;

     useEffect(() => {    
        console.log(state.docIdToReview);
    });

      const handleReviewCancel = () => {
        actions.makeReviewModalInvisible();
      }

      const handleSubmit = (values: any) => {
        actions.makeReviewModalInvisible();
        const user: any = jwt(token);

        const review : ICreateReview = 
        {
          description: values.description,
          score: values.score,
          doctorId:  state.docIdToReview,
          patientId: user.NameIdentifier,
        };

        reviewService.createReview(review);
     }
     
     const { TextArea } = Input;


    return(  
        <Modal title="Створити відгук"
           open={state.IsReviewShown} 
           onCancel={handleReviewCancel}
           footer={null}>
              <h3 style = {{marginBottom: 10}}>{state.docSurnameToReview + " " + state.docNameToReview + " "+ state.docFatherNameToReview}</h3>
              <Form form = {reviewForm} onFinish={handleSubmit}>
                   <Form.Item
                      name="description"
                      label="Опис">
                      <TextArea placeholder="Description" />
                  </Form.Item>
                  <Form.Item
                      name="score"
                      label="Оцінка">
                      <Rate allowHalf/>  
                  </Form.Item>
                  
                  <Form.Item shouldUpdate>
                     {() => (
                      <Button
                          type="primary"
                          style={{ background: "#52c41a", borderColor: "green" }}
                          htmlType="submit">
                          Відправити
                      </Button>
                      )}
                  </Form.Item>
              </Form>
        </Modal>)
}


