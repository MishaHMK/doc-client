import {useEffect, useRef} from "react"
import React, { useState } from 'react';
import { Modal, Form, List, Input, Button} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { useMessageStore } from "../stores/message.store";
import MessageApi from "../api/messageApi";
import TimeAgo from 'timeago-react';
import { SendOutlined } from '@ant-design/icons';
import { ICreateMessage } from "../interfaces/ICreateMessage";
import { IMessage } from "../interfaces/IMessage";
import { useScrollTo } from 'react-use-window-scroll';
import AuthLocalStorage from "../AuthLocalStorage";

export const MessageThreadModal: React.FC = () => { 

    const token = AuthLocalStorage.getToken() as string;
    const [sendForm] = useForm();
    const [state, actions] = useUserStore();
    //const [messagesData, setData] = useState<IMessage[]>();
    const [messageState, messageActions] = useMessageStore();

    const [scrollNumber, setScrollNumber] = useState(0);
    let msgService = new MessageApi();

    const messagesEndRef = React.createRef<HTMLDivElement>();

    useEffect(() => {  
        scrollToDown();
        messageActions.createHubConnection(token, state.receiverName);
    }, [state.senderName, state.receiverName]);

    useEffect(() => {  
       setScrollNumber(messageState.messageThreadSource.length * 100);
       messageActions.createHubConnection(token, state.receiverName);
    }, []);


    const scrollToDown = () => {
        messagesEndRef.current?.scrollTo(0, 1000000000);
  };


    const handleCancel = () => {
          actions.makeThreadModalInvisible();
          messageActions.stopHubConncetion();
    };

    const handleSubmit = async (values: any) => {
        const messageToCreate : ICreateMessage = {
          content: values.content,
          senderName: state.senderName,
          recipientName: state.receiverName
        }

        ///messageActions.createHubConnection(token, state.receiverName);
        messageActions.sendMessage(messageToCreate);
        //messageActions.createHubConnection(token, state.receiverName);

        sendForm.setFieldsValue({
          content: "",
      });
  };


    return(  
        <Modal title= {state.receiverName}
           open={state.IsThreadShown} 
           onCancel={handleCancel}
           footer={ <Form form = {sendForm} onFinish={handleSubmit}>
                      <Input.Group compact>
                        <br></br>
                        <Button onClick={scrollToDown} shape="circle"
                                style={{ marginRight: 20 }} ><SendOutlined /></Button>
                        <Form.Item name="content">
                          <Input placeholder = 'Write a message...' style={{ width: 300, textAlign: "left" }}/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit"
                                style={{ marginRight: 60 }} ><SendOutlined /></Button>
                      </Input.Group>
                  </Form>}>

            <div ref={messagesEndRef} 
              style={{
                  height: 400,
                  overflow: 'auto',
                  padding: '0 16px'
                }}> 
                    <List 
                      dataSource={messageState.messageThreadSource}
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
      
            </div>     
        </Modal>)
}
