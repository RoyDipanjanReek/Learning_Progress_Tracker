import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 SECONDS

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.inConnected = false;

    //configure mongoose setting
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log("mongo db connected succesfully");
      this.inConnected = true;
    });
    mongoose.connection.on("error", () => {
      console.log("mongo db connection error");
      this.inConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("mongo db disconnection");
      this.handleDisconnection();
    });

    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("Mongo db URI is not define in enc variable ");
      }

      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 500,
        socketTimeoutMS: 45000,
        family: 4, // use IPv4
      };

      if (process.env.NODE_ENV === "devlopment") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      this.retryCount = 0; // reset retryCount on success
    } catch (error) {
      console.error(error.message);
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `retring connection... attempt ${this.retryCount} of ${MAX_RETRIES}`
      );
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve;
        }, RETRY_INTERVAL)
      );
      return this.connect();
    } else {
      console.log(`Failed to connect after ${MAX_RETRIES} attempt`);
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if (!this.inConnected) {
      console.log("Attempting to reconnected to mongo db....");
      this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection through app termination");
      process.exit(0);
    } catch (error) {
      console.log("error durion database disconnection", error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.inConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

// create singleton intence

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDbStatus = dbConnection.getConnectionStatus.bind(dbConnection);