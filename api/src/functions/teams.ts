import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

interface Document {}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'teams',
    connection: 'CosmosDbConnectionString',
});

export async function getTeam(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    cosmosInput.sqlQuery = 'SELECT * from c where c.slug = {slug}';
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

export async function getTeams(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    cosmosInput.sqlQuery = 'SELECT * from c';
    const teams = <Document>context.extraInputs.get(cosmosInput);
    if (!teams) {
        return {
            status: 404,
            body: 'Teams not found',
        };
    } else {
        return {
            jsonBody: teams,
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

app.http('getTeams', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'teams',
    extraInputs: [cosmosInput],
    handler: getTeams,
});
