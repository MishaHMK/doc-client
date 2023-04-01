import { createStore, createHook, Action } from 'react-sweet-state';
import AuthLocalStorage from "../AuthLocalStorage";
import {
    HubConnection,
    HubConnectionBuilder
  } from '@microsoft/signalr';
import { ICreateMessage } from "../interfaces/ICreateMessage";  
import { message } from 'antd';


type State = { connection: any, messageThreadSource: any[]};
type Actions = typeof actions;


const HUB_URL = "https://localhost:44375/hubs/";

var hubConnection: HubConnection;

const initialState: State = {
    connection: '',
    messageThreadSource: []
};

const actions = {
    createHubConnection: (token: string, otherUserName: string) : Action<State> => 
    async ({ setState, getState }) => {
        hubConnection = new HubConnectionBuilder()
            .withUrl(HUB_URL + 'message?user=' + otherUserName, 
            {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();  

        hubConnection.start().catch(error => console.log(error));    

        hubConnection.on('ReceiveMessageThread', messages => {
            setState({
                messageThreadSource: messages
            });
            //console.log(messages);
          })

        hubConnection.on('NewMessage', message => {
            setState({
                messageThreadSource: [...getState().messageThreadSource, message]
              });
          })  
    },

    stopHubConncetion: () : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.stop().catch(error => console.log(error)); 
    },

    sendMessage: (createMessage: ICreateMessage) : Action<State> => 
    async ({ setState, getState }) => {    
       /* hubConnection.invoke("SendMessage", {createMessage})
              .catch(error => console.log(error)); */

        hubConnection.invoke("SendMessage", createMessage)
              .catch(error => console.log(error));      

        console.log(createMessage);        
    },

   /* sendMessage: (username: string, content: string) : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.invoke("SendMessage", {recipientUserName: username, content})
              .catch(error => console.log(error)); 
    }, */

};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useMessageStore = createHook(Store);