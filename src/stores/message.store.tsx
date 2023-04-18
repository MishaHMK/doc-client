import { createStore, createHook, Action } from 'react-sweet-state';
import {
    HubConnection,
    HubConnectionBuilder
  } from '@microsoft/signalr';
import { ICreateMessage } from "../interfaces/ICreateMessage";  


type State = { connection: any, messageThreadSource: any[], unreadCount: number};
type Actions = typeof actions;


const HUB_URL = "https://localhost:44375/hubs/";

var hubConnection: HubConnection;

const initialState: State = {
    connection: '',
    messageThreadSource: [], 
    unreadCount: 0
};

const actions = {
    createHubConnection: (token: string, otherUserName?: string) : Action<State> => 
    async ({ setState, getState }) => {
        hubConnection = new HubConnectionBuilder()
            .withUrl(HUB_URL + 'message', 
            //.withUrl(HUB_URL + 'message?user=' + otherUserName, 
            {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();  

        hubConnection.start().catch(error => console.log(error));    

        hubConnection.on('NewMessage', message => {
            setState({
                messageThreadSource: [...getState().messageThreadSource, message]
              });
          })  

        hubConnection.on('ReceiveUnreadCount', number => {
            setState({
                unreadCount: number
              });
          })   

        hubConnection.on('RecieveMessageThread', messages => {
            setState({
                messageThreadSource: messages
              });
          })    

        hubConnection.on('DeleteMessage', id => {
            const newList = getState().messageThreadSource.filter(msg => msg.id != id);
            setState({
                messageThreadSource: newList
              });
          })      
    },

    stopHubConncetion: () : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.stop().catch(error => console.log(error)); 
    },

    sendMessage: (createMessage: ICreateMessage) : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.invoke("SendMessage", createMessage)
              .catch(error => console.log(error));             
    },

    recieveThread: (sender: string, other: string) : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.invoke("RecieveThread", sender, other)
              .catch(error => console.log(error));        
    },

    receiveUnread: (reciever: string) : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.invoke("RecieveUnread", reciever)
              .catch(error => console.log(error));          
    },

    removeMessage: (id: any, userName: any) : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.invoke("RemoveMessage", id, userName)
              .catch(error => console.log(error));          
    }

};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useMessageStore = createHook(Store);