import { app, HttpRequest, HttpResponseInit, input, InvocationContext, output } from '@azure/functions';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { Guid } from 'guid-typescript';

interface Team {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
  color: string;
  seasonWins: number;
  seasonLosses: number;
  ranking: number;
  defaultSkaterImage: string;
  type: string;
}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'teams',
    connection: 'CosmosDbConnectionString',
    partitionKey: '{slug}'
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'acderby',
    containerName: 'teams',
    connection: 'CosmosDbConnectionString',
    createIfNotExists: false
});

export async function getTeam(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const teams = <Document>context.extraInputs.get(cosmosInput);
    if (!teams) {
        return {
            status: 404,
            body: 'Team not found',
        };
    } else {
        return {
            jsonBody: teams[0],
        };
    }
}

export async function addTeam(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const team = JSON.parse(formData.get('team') as string) as Team;
    team.id = Guid.create().toString();
    team.type = "Misc";
    team.slug = team.name.split(" ")[0];
    const temp: any = formData.get('logo');
    if(temp) {
        const uploadedFile: File = temp as File;
        const fileContents = await uploadedFile.arrayBuffer();
        const fileContentsBuffer: Buffer = Buffer.from(fileContents);
        const uploadSuccess = await uploadBlob(`${team.slug}.png`, fileContentsBuffer);
        if (uploadSuccess) team.imageUrl = `https://acrdphotos.blob.core.windows.net/photos/${team.slug}.png`;
    }
    // save to cosmosDb
    context.extraOutputs.set(cosmosOutput, team);
    return { status: 200, body: team.id };
}

app.http('getTeam', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'teams/{slug}',
    extraInputs: [cosmosInput],
    handler: getTeam,
});

app.http('addTeam', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'teams/add',
    extraOutputs: [cosmosOutput],
    handler: addTeam,
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
