import { Channel, connect, Connection, Message } from "amqplib";

export default class RabbitmqServer {
    private conn!: Connection;
    private channel!: Channel;

    constructor(private uri: string) { }

    async start(): Promise<void> {
        this.conn = await connect(this.uri)
        this.channel = await this.conn.createChannel()

        console.log('Sucesso: Comunicação efetuado com sucesso: ');
    }

    async publishInQueue(queue: string, message: string) {
        return this.channel.sendToQueue(queue, Buffer.from(message))
    }

    async consume(queue: string, callback: (message: Message) => void) {
        return this.channel.consume(queue, (message) => {
            callback(message);
            this.channel?.ack(message)
        })
    }

    async publishInExchange(
        exchange: string,
        routingKey: string,
        message: string
    ): Promise<boolean> {
        return this.channel.publish(exchange, routingKey, Buffer.from(message))
    }
}