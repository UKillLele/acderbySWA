import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

interface Record {
  date: string
}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'bouts',
    sqlQuery: 'SELECT c.date from c',
    connection: 'CosmosDbConnectionString'
});

export async function getYears(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const records = <Record[]>context.extraInputs.get(cosmosInput);
    const years = [];
    records.forEach((record: Record) => {
        const year = new Date(record.date).getFullYear();
        if (!years.includes(year)) {
            years.push(year);
        }
    })
    if (!years) {
        return {
            status: 404,
            body: 'Years not found'
        };
    } else {
        return {
            jsonBody: years.sort((a, b) => a - b)
        };
    }
}

app.http('getYears', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'years',
    extraInputs: [cosmosInput],
    handler: getYears
});
