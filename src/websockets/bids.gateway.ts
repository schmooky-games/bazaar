import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BidsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly logger: CustomLoggerService) {}

  private auctionSubscriptions: Map<string, Set<string>> = new Map();
  private connectedClients: Set<string> = new Set();

  private logState(action: string) {
    const context = {
      action,
      connectedClientsCount: this.connectedClients.size,
      connectedClientIds: Array.from(this.connectedClients),
      auctionSubscriptions: Array.from(this.auctionSubscriptions.entries()).map(
        ([auctionId, subscribers]) => ({
          auctionId,
          subscribersCount: subscribers.size,
          subscriberIds: Array.from(subscribers),
        }),
      ),
    };
    this.logger.log('WebSocket State', JSON.stringify(context));
  }

  afterInit(server: any) {
    this.logger.log('Sockets init');
  }

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    this.logger.log(`\n👥 New client connected: ${client.id}`);
    this.logState('New Connection');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`\n❌ Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);

    this.auctionSubscriptions.forEach((subscribers, auctionId) => {
      if (subscribers.has(client.id)) {
        subscribers.delete(client.id);
        client.leave(`auction:${auctionId}`);
        this.logger.log(
          `Removed client ${client.id} from auction ${auctionId}`,
        );
      }
    });

    for (const [
      auctionId,
      subscribers,
    ] of this.auctionSubscriptions.entries()) {
      if (subscribers.size === 0) {
        this.auctionSubscriptions.delete(auctionId);
        this.logger.log(
          `Removed empty auction ${auctionId} from subscriptions`,
        );
      }
    }

    this.logState('Disconnection');
  }

  @SubscribeMessage('subscribeToAuction')
  async handleSubscription(
    @ConnectedSocket() client: Socket,
    @MessageBody() auctionId: string,
  ) {
    this.logger.log(
      `\n📝 Subscription request from client ${client.id} to auction ${auctionId}`,
    );

    if (!this.auctionSubscriptions.has(auctionId)) {
      this.logger.log(`Creating new subscription set for auction ${auctionId}`);
      this.auctionSubscriptions.set(auctionId, new Set());
    }

    this.auctionSubscriptions.get(auctionId).add(client.id);
    await client.join(`auction:${auctionId}`);

    this.logState('New Subscription');

    return { success: true, message: `Subscribed to auction ${auctionId}` };
  }

  @SubscribeMessage('unsubscribeFromAuction')
  async handleUnsubscription(
    @ConnectedSocket() client: Socket,
    @MessageBody() auctionId: string,
  ) {
    this.logger.log(
      `\n🚫 Unsubscription request from client ${client.id} from auction ${auctionId}`,
    );

    if (this.auctionSubscriptions.has(auctionId)) {
      this.auctionSubscriptions.get(auctionId).delete(client.id);
      this.logger.log(
        `Removed client ${client.id} from auction ${auctionId} subscribers`,
      );

      if (this.auctionSubscriptions.get(auctionId).size === 0) {
        this.auctionSubscriptions.delete(auctionId);
        this.logger.log(
          `Removed empty auction ${auctionId} from subscriptions`,
        );
      }
    }

    await client.leave(`auction:${auctionId}`);

    this.logState('Unsubscription');

    return { success: true, message: `Unsubscribed from auction ${auctionId}` };
  }

  async notifyPriceUpdate(auctionId: string, newPrice: number) {
    this.logger.log(`\n💰 Sending price update for auction ${auctionId}`);
    this.logger.log(`New price: ${newPrice}`);
    this.logger.log(
      `Number of subscribers: ${this.auctionSubscriptions.get(auctionId)?.size || 0}`,
    );

    this.server.to(`auction:${auctionId}`).emit('priceUpdate', {
      auctionId,
      newPrice,
      timestamp: new Date(),
    });

    this.logState('Price Update Notification');
  }

  async notifyAuctionEnd(auctionId: string, winningBid: any) {
    this.logger.log(
      `\n🏁 Sending auction end notification for auction ${auctionId}`,
    );
    this.logger.log(`Winning bid: ${JSON.stringify(winningBid)}`);
    this.logger.log(
      `Number of subscribers: ${this.auctionSubscriptions.get(auctionId)?.size || 0}`,
    );

    this.server.to(`auction:${auctionId}`).emit('auctionEnd', {
      auctionId,
      winningBid,
      timestamp: new Date(),
    });

    this.logState('Auction End Notification');
  }
}
