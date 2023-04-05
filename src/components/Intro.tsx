import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import AuthLocalStorage from "../AuthLocalStorage";
import jwt from "jwt-decode";

export const Intro: React.FC = () => {

    const [state, actions] = useUserStore();
    const [chosenSpec, setChosenSpec] = useState("");
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);

    useEffect(() => {

    }, []);


     const handleSelectSpec = (value : any) => {
        setChosenSpec(value);
    } 

    return (
        <div> 
            <h2>INTRO PAGE</h2>
       </div>
    );
 };