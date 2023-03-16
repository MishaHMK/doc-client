import { createStore, createHook, Action } from 'react-sweet-state';
import AuthLocalStorage from "../AuthLocalStorage";
import {
    HubConnection,
    HubConnectionBuilder
  } from '@microsoft/signalr';


type State = {  onlineUsers: any[], connection: any};
type Actions = typeof actions;


const token = AuthLocalStorage.getToken() as string;
const HUB_URL = "https://localhost:44375/hubs/presence"; 

var hubConnection: HubConnection;

const initialState: State = {
    onlineUsers: [],
    connection: ''
};

const actions = {
    createHubConnection: (token: string) : Action<State> => 
    async ({ setState, getState }) => {
        hubConnection = new HubConnectionBuilder()
            .withUrl(HUB_URL, 
            {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();  

        hubConnection.start().catch(error => console.log(error));    

        hubConnection.on('UserIsOnline', userId => {
            console.log(userId + ' has connected');
          }) 

        hubConnection.on('UserIsOffline', userId => {
            console.log(userId + ' has disconnected');
          })

        hubConnection.on('GetOnlineUsers', users => {
            setState({
                onlineUsers: users
            });
            console.log(users);
        })
    },

    stopHubConncetion: () : Action<State> => 
    async ({ setState, getState }) => {    
        hubConnection.stop().catch(error => console.log(error)); 
    }
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useSignalrStore = createHook(Store);