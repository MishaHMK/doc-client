import {useEffect, useRef} from "react"
import React, { useState } from 'react';
import { Modal, Form, List, Avatar, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import AuthLocalStorage from "../AuthLocalStorage";
import VirtualList from 'rc-virtual-list';
import MessageApi from "../api/messageApi";
import TimeAgo from 'timeago-react';
import { SendOutlined } from '@ant-design/icons';

const ContainerHeight = 500;

export const MessageThreadModal: React.FC = () => { 

    const [createForm] = useForm();
    const [state, actions] = useUserStore();
    const token = AuthLocalStorage.getToken() as string;
    const [data, setData] = useState<any[]>([]);
    const ref = React.useRef<null | HTMLDivElement>(null);
    let msgService = new MessageApi();
    
    useEffect(() => {  
        fetchData();
        scrollToBottom();
    }, [data]);
    


    const fetchData = async () => {
        await msgService.getMessageThread("", "")
            .then(async (response) => {
                setData(response.data);
        });
    };

    const scrollToBottom = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth'})
      }

    const handleCancel = () => {
        //actions.makeModalInvisible();
    }

    const handleSubmit = (values: any) => {
        
     }

    const deleteAppointment = (id : any) : any => {
      actions.deleteAppointment(id);
      //actions.makeModalInvisible();
    }

    const approveAppointment = () : any => {
      actions.approveAppointment(state.currentEventId, state.currentEventStatus);
      //actions.makeModalInvisible();
    }

    return(  
        <Modal title="Chat" 
           //open={state.IsThreadShown} 
           open={true} 
           onCancel={handleCancel}
           footer={null}>
            <div ref={ref}> 
            <VirtualList
                    data={data}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="email">
                        {(item: any) => (
                        <List.Item key={item.senderId}>
                            <List.Item.Meta
                            style={{ width: 'calc(100% - 60px)' }}
                            title={<div><a>{item.senderUserName + " "}</a> 
                                        <TimeAgo datetime={item.messageSent}/>
                                </div>}
                            description={item.content}/>
                        </List.Item>
                    )}
              </VirtualList>
              <Form form = {createForm} onFinish={handleSubmit}>
              <Input.Group compact>
                <br></br>
                <Input style={{ width: 'calc(100% - 60px)' }} defaultValue="https://ant.design" />
                <Button type="primary"><SendOutlined /></Button>
              </Input.Group>
              </Form>
            </div>     
        </Modal>)
}
