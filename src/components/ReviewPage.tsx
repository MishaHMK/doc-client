import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Card, List, Pagination, Rate } from 'antd';
import ReviewApi from "../api/reviewApi";
import AuthLocalStorage from '../AuthLocalStorage';
import jwt_decode from "jwt-decode";
import { useSignalrStore } from '../stores/signalr.store';
import { format } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

const pageSize = 6;

export const ReviewPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    let reviewService = new ReviewApi();
    const [state, actions] = useUserStore();
    const [signalState, signalActions] = useSignalrStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviews, setReviews] = useState([]);

    const queryParameters = new URLSearchParams(window.location.search);
    const userId = window.location.pathname;
    const id = userId.substring(userId.lastIndexOf('/') + 1);

    useEffect(() => {  
        fetchData();
        console.log(id);
    }, [currentPage]);

    useEffect(() => {  
        fetchData();
        console.log(id);
    }, []);


    const fetchData = async () => {
        await reviewService.getPagedReviews(id, currentPage, pageSize)
            .then(async (response) => {
               settotalItems(response.data.totalItems);
               setReviews(response.data.pagedList);
        });
    };

    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

        

    return (
        <div style = {{marginTop: "3%", marginBottom: "10%"}}> 
            <h2 style = {{marginBottom: "2%"}}>Відгуки</h2>

            <List
                grid={{ column: 3 }}
                dataSource={reviews}
                renderItem={(item : any) => (
                <List.Item>
                        <Card title={ "Відгук від " + item.patientName + " ( " + format(new Date(item.postedOn), 'dd.MM.yyyy')  + " )"}
                              bordered = {true}
                              style = {{boxShadow: '10px 5px 5px grey'}}
                            >
                        
                            <i>{item.description}</i>
                            <br></br>
                            <br></br>
                            <Rate disabled = {true} allowHalf defaultValue={item.score}></Rate>
                        </Card>
                </List.Item>
            )}
            />

            <Pagination
                pageSize={pageSize}
                current={currentPage}
                total={totalItems}
                onChange={handleChange}
                style={{ bottom: "0px" }}
            />
       </div>
    );
 };

