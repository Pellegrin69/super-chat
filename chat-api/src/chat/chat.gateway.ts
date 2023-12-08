import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('ChatGateway');

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('chat-message')
  handleChatMessage(client: any, payload: any): void {
    logger.log(`Payload: ${JSON.stringify(payload)}`);
    this.server.emit('chat-message', payload);
  }

  @SubscribeMessage('chat-translate')
  async handleChatTranslation(client: any, payload: any): Promise<void> {
    try {
      logger.log(`Payload: ${JSON.stringify(payload)}`);

      payload.message = await this.chatService.translateMessage(
        payload.message,
        payload.targetLanguage,
      );
      logger.log(`Payload: ${JSON.stringify(payload)}`);

      this.server.to(client.id).emit('chat-translate', payload);
    } catch (error) {
      logger.error(`Error translating message: ${error.message}`);
    }
  }

  @SubscribeMessage('validate-message')
  async handleValidateMessage(
    client: any,
    payload: { message: string },
  ): Promise<void> {
    logger.log(`payload.message: ${payload.message}`);
    const validationResult = await this.chatService.validateMessage(
      payload.message,
    );
    logger.log(`validationResult: ${validationResult}`);

    this.server.to(client.id).emit('chat-message', {
      content: validationResult,
      timeSent: new Date().toISOString(),
      username: 'ChatGPT',
    });
  }

  handleConnection(client: any) {
    console.log('client connected ', client.id);
  }

  handleDisconnect(client: any): any {
    console.log('client disconnected ', client.id);
  }

  users: object[] = [];
  @SubscribeMessage('add-user')
  setUserName(client: any, payload: any): void {
    const user: object = {
      id: client.id,
      name: payload.username,
    };
    this.users.push(user);
    client.emit('get-user', user);
  }
}
