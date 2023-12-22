import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

interface Document {}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'teams',
    connection: 'CosmosDbConnectionString',
    partitionKey: '{slug}'
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

app.http('getTeam', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'teams/{slug}',
    extraInputs: [cosmosInput],
    handler: getTeam,
});
