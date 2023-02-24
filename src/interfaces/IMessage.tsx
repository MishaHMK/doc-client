export interface IMessage {
    id: number;
    senderId: string;
    senderUserName: string;
    recipientId: string;
    recipientUserName: string;
    content: string;
    dateRead?: Date;
    messageSent: Date;
}