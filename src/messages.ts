export enum MessageType {
  QUERY,
}

export interface Message {
  type: MessageType;
  payload: any;
}
