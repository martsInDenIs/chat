import "reflect-metadata";
import express, {Request, Response, Express} from 'express';
import http from 'http';
import {NextHandleFunction} from 'connect';
import * as WebSocket from 'ws';
import {createConnection, getConnectionOptions, ConnectionOptions} from 'typeorm';
import {authUserController} from "./controllers/authController";
import {webSocketController} from './controllers/webSocketController';
import {User} from './entities/user';
import cors from 'cors';


const app: Express = express();
const server: http.Server = http.createServer(app);
const wss: WebSocket.Server = new WebSocket.Server({server});

const clients: Map<number, {validUser: User, ws: WebSocket}> = new Map();

app.use(cors());

const jsonParser: NextHandleFunction = express.json(); 


app.post('/',jsonParser,async (req: Request, res: Response): Promise<void> =>{
    await authUserController(req.body,res);
});


wss.on("connection",async (ws: WebSocket, req: http.IncomingMessage): Promise<void>=>{
   webSocketController.onConnection(ws,req.url as string);
});


server.listen(8080, async (): Promise<void> =>{
    const options: ConnectionOptions = await getConnectionOptions();
    await createConnection(options);

    console.log("server has started");
})
