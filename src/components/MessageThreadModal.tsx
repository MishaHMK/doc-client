import {useEffect, useRef} from "react"
import React, { useState } from 'react';
import { Modal, Form, List, Input, Button} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import MessageApi from "../api/messageApi";
import TimeAgo from 'timeago-react';
import { SendOutlined } from '@ant-design/icons';
import { ICreateMessage } from "../interfaces/ICreateMessage";
import { IMessage } from "../interfaces/IMessage";

export const MessageThreadModal: React.FC = () => { 

    const [sendForm] = useForm();
    const [state, actions] = useUserStore();
    const [messagesData, setData] = useState<IMessage[]>();
    let msgService = new MessageApi();

    const messageEl = useRef<null | HTMLDivElement>(null);

    useEffect(() => {  
        fetchData();
        scrollToDown();
    }, [state.senderName, state.receiverName]);

    
    const fetchData = async () => {
      if(state.senderName != "" && state.receiverName != "") {
        await msgService.getMessageThread(state.senderName, state.receiverName)
            .then(async (response) => {
                setData(response.data);
        });
      }
          
    };

    const scrollToDown = async () => {
      if (messageEl) {
        messageEl.current?.addEventListener('DOMNodeInserted', (event: { currentTarget: any; }) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
        });
      }
  };


    const handleCancel = () => {
        actions.makeThreadModalInvisible();
  };

    const handleSubmit = async (values: any) => {
        const messageToCreate : ICreateMessage = {
          content: values.content,
          senderName: state.senderName,
          recipientName: state.receiverName
        }

        await msgService.sendMessage(messageToCreate);

        await msgService.getMessageThread(state.senderName, state.receiverName)
            .then(async (response) => {
                setData(response.data);
        });

        sendForm.setFieldsValue({
          content: "",
      });
        
        scrollToDown();
  };


    return(  
        <Modal title="Chat" 
           open={state.IsThreadShown} 
           onCancel={handleCancel}
           footer={null}>
            <div ref={messageEl} style={{
                height: 400,
                overflow: 'auto',
                padding: '0 16px'
              }}> 
                  <List
                    dataSource={messagesData}
                    renderItem={(item: any) => (
                      <List.Item key={item.senderId}>
                            <List.Item.Meta
                            style={{ width: 'calc(100% - 60px)' }}
                            title={<div><a>{item.senderUserName + " "}</a> 
                                        <TimeAgo datetime={item.messageSent}/>
                                </div>}
                            description={item.content}/>
                        </List.Item>
                    )}
                  />
                  <Form form = {sendForm} onFinish={handleSubmit}>
                      <Input.Group compact>
                        <br></br>
                        <Form.Item name="content">
                          <Input placeholder = 'Write a message...' style={{ width: 350 }}/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit"><SendOutlined /></Button>
                      </Input.Group>
                  </Form>

             
            </div>     
        </Modal>)
}
