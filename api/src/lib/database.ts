import { CosmosClient } from "@azure/cosmos";

class CosmosDb {

  // Cosmos DB connection information
  // Other connection options can be found here: https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-sdk-node
  key: string;
  endpoint: string;
  databaseName: string;
  containerName: string;
  partitionKeyPath: string[];

  // Initialize connection variable
  connected = false;

  // Database client
  cosmosClient = null;
  database = null;
  container = null;

  constructor({ key, endpoint, databaseName, containerName, partitionKeyPath }) {
    this.key = key;
    this.endpoint = endpoint;
    this.databaseName = databaseName;
    this.containerName = containerName;
    this.partitionKeyPath = partitionKeyPath;
  }

  async init() {

    if (!this.connected) {

      console.log('Connecting to Cosmos DB');

      // Authenticate to Azure Cosmos DB
      this.cosmosClient = new CosmosClient({ endpoint: this.endpoint, key: this.key });

      const dbResult = await this.cosmosClient.databases.get({
        id: this.databaseName,
      });
      this.database = dbResult.database;

      const containerResult = await this.database.containers.get({
        id: this.containerName,
        partitionKey: {
          paths: this.partitionKeyPath,
        },
      });
      this.container = containerResult.container;
      this.connected = true;
      console.log('Connected to Cosmos DB');

    } else {
      console.log('Already connected to Cosmos DB');
    }
  }
}


export default CosmosDb;