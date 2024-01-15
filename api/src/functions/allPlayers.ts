import { CosmosClient } from '@azure/cosmos';
import { app, HttpRequest, HttpResponseInit, input, output, InvocationContext, CosmosDBOutput } from '@azure/functions';
import { BlobSASPermissions, BlobServiceClient, SASProtocol, StorageSharedKeyCredential } from '@azure/storage-blob';
import { Guid } from 'guid-typescript';

interface Person {
    id: string,
    name: string,
    number: string,
    imageUrl: string,
    teams: Position[]
}

interface Position {
    id: string,
    positionType: PositionType
}

enum PositionType {
    member,
    coCaptain,
    captain,
    benchCoach,
    headCoach
}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'players',
    sqlQuery: 'SELECT * FROM players',
    connection: 'CosmosDbConnectionString',
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'acderby',
    containerName: 'players',
    connection: 'CosmosDbConnectionString',
    createIfNotExists: false
});

export async function getAllPlayers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const players = <Person[]>context.extraInputs.get(cosmosInput);
    if (!players) {
        return {
            status: 404,
            body: 'Players not found',
        };
    } else {
        return {
            jsonBody: players,
        };
    }
}

export async function updatePlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const person: Person = {
        id: formData.get('id') as string,
        name: formData.get('name') as string,
        number: formData.get('number') as string,
        teams: <Position[]> JSON.parse(formData.get('positions') as string),
        imageUrl: formData.get('imageUrl') as string ?? ""
    }
    // replace existing record entirely; upload image if file provided
    const temp: any = formData.get('imageFile');
    if(temp) {
        const uploadedFile: File = temp as File;
        const fileContents = await uploadedFile.arrayBuffer();
        const fileContentsBuffer: Buffer = Buffer.from(fileContents);
        const uploadSuccess = await uploadBlob(`${person.name}.png`, fileContentsBuffer);
        if (uploadSuccess) person.imageUrl = `https://acrdphotos.blob.core.windows.net/photos/${person.name}.png`;
    }
    // save to cosmosDb
    context.extraOutputs.set(cosmosOutput, person);
    return { status: 200 };
}

export async function addPlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const person: Person = {
        id: Guid.create().toString(),
        name: formData.get('name') as string,
        number: formData.get('number') as string,
        teams: <Position[]> JSON.parse(formData.get('positions') as string),
        imageUrl: ""
    }
    // replace existing record entirely; upload image if file provided
    const temp: any = formData.get('imageFile');
    if(temp) {
        const uploadedFile: File = temp as File;
        const fileContents = await uploadedFile.arrayBuffer();
        const fileContentsBuffer: Buffer = Buffer.from(fileContents);
        const uploadSuccess = await uploadBlob(`${person.name}.png`, fileContentsBuffer);
        if (uploadSuccess) person.imageUrl = `https://acrdphotos.blob.core.windows.net/photos/${person.name}.png`;
    }
    // save to cosmosDb
    context.extraOutputs.set(cosmosOutput, person);
    return { status: 200 };
}

export async function deletePlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    if (id) {
        // delete from cosmosDb
        // have to manually set client for delete
        const client = new CosmosClient(process.env.CosmosDbConnectionString);
        const container = client.database("acderby").container("players");
        const item = container.item(id, id);
        item.delete();
        return { status: 200 };
    };
    return {
        status: 404,
        body: "Skater not found"
    }
}

app.http('getAllPlayers', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'players',
    extraInputs: [cosmosInput],
    handler: getAllPlayers,
});

app.http('updatePlayer', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'update-person',
    extraOutputs: [cosmosOutput],
    handler: updatePlayer,
});

app.http('addPlayer', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'add-person',
    extraOutputs: [cosmosOutput],
    handler: addPlayer,
});

app.http('deletePlayer', {
    methods: ['DELETE'],
    authLevel: 'function',
    route: 'delete-person',
    handler: deletePlayer,
});

async function uploadBlob(fileName: string, blob: Buffer) {
    const serviceName = 'acrdphotos';
    const sharedKeyCredential = new StorageSharedKeyCredential(
    serviceName,
    process.env.AzureStorageAccountKey
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${serviceName}.blob.core.windows.net`,
    sharedKeyCredential
  );
  const containerClient = blobServiceClient.getContainerClient('photos');
  // container definitely exists but in case something goes wrong don't break everything
  if (containerClient) {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(blob);
    return true;
  }
  return false;
}
