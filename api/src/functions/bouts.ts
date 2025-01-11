import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

interface Document { }

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'bouts',
    connection: 'CosmosDbConnectionString',
});

export async function getBouts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    cosmosInput.sqlQuery = 'SELECT * from c where c.date like"%2025%"';
    const bouts = <Document>context.extraInputs.get(cosmosInput);
    if (!bouts) {
        return {
            status: 404,
            body: 'Bouts not found',
        };
    } else {
        return {
            jsonBody: bouts,
        };
    }
}

app.http('getBouts', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'bouts',
    extraInputs: [cosmosInput],
    handler: getBouts,
});
