import { CosmosClient } from '@azure/cosmos';
import { app, HttpRequest, HttpResponseInit, input, InvocationContext, output } from '@azure/functions';
import { Guid } from 'guid-typescript';

interface Bout {
    id: string,
    name: string,
    date: string,
    homeTeam?: string,
    homeTeamScore?: string,
    homeTeamMVPJammer?: string,
    homeTeamMVPBlocker?: string,
    awayTeam?: string,
    awayTeamScore?: string,
    awayTeamMVPJammer?: string,
    awayTeamMVPBlocker?: string,
    imageUrl?: string
}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'bouts',
    sqlQuery: 'SELECT * from c WHERE CONTAINS(c.date, {year}, true)',
    connection: 'CosmosDbConnectionString'
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'acderby',
    containerName: 'bouts',
    connection: 'CosmosDbConnectionString',
    createIfNotExists: false
});

export async function getBouts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const bouts = <Bout[]>context.extraInputs.get(cosmosInput);
    if (!bouts) {
        return {
            status: 404,
            body: 'Bouts not found'
        };
    } else {
        return {
            jsonBody: bouts
        };
    }
}

export async function updateBouts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const bouts = JSON.parse(formData.get('bouts') as string) as Bout[];
    context.log(bouts);
    // save to cosmosDb
    context.extraOutputs.set(cosmosOutput, bouts);
    return { status: 200 };
}

export async function addDates(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const bouts = [];
    const boutsIn = JSON.parse(formData.get('bouts') as string) as Bout[];
    boutsIn.forEach((b: Bout) => {
        const bout1: Bout = {
            id: Guid.create().toString(),
            date: b.date.split('T')[0].concat("T19:00:00Z"),
            name: b.name
        }
        bouts.push(bout1);
        const bout2: Bout = {
            id: Guid.create().toString(),
            date: b.date.split('T')[0].concat("T20:30:00Z"),
            name: b.name
        }
        bouts.push(bout2);
    });
    context.extraOutputs.set(cosmosOutput, bouts);
    return { status: 200};
}

export async function deleteDate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const bouts = JSON.parse(formData.get('bouts') as string) as Bout[];
        if (bouts.length > 0) {
            // delete from cosmosDb
            // have to manually set client for delete
            const client = new CosmosClient(process.env.CosmosDbConnectionString);
            const container = client.database("acderby").container("bouts");
            bouts.forEach((bout: Bout) => {
                const item = container.item(bout.id, bout.date);
                item.delete();
            })
            return { status: 200 };
        };
        return {
            status: 404,
            body: "Date not found"
        }
}

app.http('getBouts', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'bouts/{year}',
    extraInputs: [cosmosInput],
    handler: getBouts
});

app.http('updateBouts', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'update-bouts',
    extraOutputs: [cosmosOutput],
    handler: updateBouts
});

app.http('addDates', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'add-dates',
    extraOutputs: [cosmosOutput],
    handler: addDates
});

app.http('deleteDate', {
    methods: ['DELETE'],
    authLevel: 'function',
    route: 'delete-date',
    extraOutputs: [cosmosOutput],
    handler: deleteDate
})
