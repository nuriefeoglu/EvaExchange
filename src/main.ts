import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { Routes } from './routes';

class Main {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.setup();
    this.routes();
  }

  private setup(): void {
    config({ path: '.env3' });
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  private routes(): void {
    this.app.use(Routes);
  }

  public startServer(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const server = new Main();
server.startServer();
