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

  private auctionSubscriptions: Map<string, Set<string>> = new Map();
  private connectedClients: Set<string> = new Set();

  private logState(action: string) {
    console.log('\n=== WebSocket State Log ===');
    console.log(`Action: ${action}`);
    console.log(`Total connected clients: ${this.connectedClients.size}`);
    console.log('Connected client IDs:', Array.from(this.connectedClients));
    console.log('\nAuction Subscriptions:');
    this.auctionSubscriptions.forEach((subscribers, auctionId) => {
      console.log(`\nAuction ${auctionId}:`);
      console.log(`- Total subscribers: ${subscribers.size}`);
      console.log(`- Subscriber IDs: ${Array.from(subscribers)}`);
    });
    console.log('==========================\n');
  }

  afterInit(server: any) {
    console.log('Sockets init');
  }

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    console.log(`\n👥 New client connected: ${client.id}`);
    this.logState('New Connection');
  }

  handleDisconnect(client: Socket) {
    console.log(`\n❌ Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);

    this.auctionSubscriptions.forEach((subscribers, auctionId) => {
      if (subscribers.has(client.id)) {
        subscribers.delete(client.id);
        client.leave(`auction:${auctionId}`);
        console.log(`Removed client ${client.id} from auction ${auctionId}`);
      }
    });

    for (const [
      auctionId,
      subscribers,
    ] of this.auctionSubscriptions.entries()) {
      if (subscribers.size === 0) {
        this.auctionSubscriptions.delete(auctionId);
        console.log(`Removed empty auction ${auctionId} from subscriptions`);
      }
    }

    this.logState('Disconnection');
  }

  @SubscribeMessage('subscribeToAuction')
  async handleSubscription(
    @ConnectedSocket() client: Socket,
    @MessageBody() auctionId: string,
  ) {
    console.log(
      `\n📝 Subscription request from client ${client.id} to auction ${auctionId}`,
    );

    if (!this.auctionSubscriptions.has(auctionId)) {
      console.log(`Creating new subscription set for auction ${auctionId}`);
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
    console.log(
      `\n🚫 Unsubscription request from client ${client.id} from auction ${auctionId}`,
    );

    if (this.auctionSubscriptions.has(auctionId)) {
      this.auctionSubscriptions.get(auctionId).delete(client.id);
      console.log(
        `Removed client ${client.id} from auction ${auctionId} subscribers`,
      );

      if (this.auctionSubscriptions.get(auctionId).size === 0) {
        this.auctionSubscriptions.delete(auctionId);
        console.log(`Removed empty auction ${auctionId} from subscriptions`);
      }
    }

    await client.leave(`auction:${auctionId}`);

    this.logState('Unsubscription');

    return { success: true, message: `Unsubscribed from auction ${auctionId}` };
  }

  async notifyPriceUpdate(auctionId: string, newPrice: number) {
    console.log(`\n💰 Sending price update for auction ${auctionId}`);
    console.log(`New price: ${newPrice}`);
    console.log(
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
    console.log(
      `\n🏁 Sending auction end notification for auction ${auctionId}`,
    );
    console.log(`Winning bid: ${JSON.stringify(winningBid)}`);
    console.log(
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
