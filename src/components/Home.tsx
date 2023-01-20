import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import AuthorizeApi from "../api/authorizeApi";

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div> 
           <h2>Hellow</h2>
        </div>
    );
 };