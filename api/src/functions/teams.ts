import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

interface Document {}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'teams',
    sqlQuery: 'SELECT * from c where c.slug = {slug}',
    connection: 'CosmosDbConnectionString',
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
            body: JSON.stringify(teams[0]),
        };
    }
}

app.http('getTeam', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    route: 'teams/{slug}',
    extraInputs: [cosmosInput],
    handler: getTeam,
});
