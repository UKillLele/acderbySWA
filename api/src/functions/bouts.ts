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

export async function updateBout(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const bout: Bout = {
        id: formData.get('id') as string,
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        homeTeam: formData.get('homeTeam') as string,
        homeTeamScore: (formData.get('homeTeamScore') as string),
        homeTeamMVPJammer: formData.get('homeTeamMVPJammer') as string,
        homeTeamMVPBlocker: formData.get('homeTeamMVPBlocker') as string,
        awayTeam: formData.get('awayTeam') as string,
        awayTeamScore: (formData.get('awayTeamScore') as string),
        awayTeamMVPJammer: formData.get('awayTeamMVPJammer') as string,
        awayTeamMVPBlocker: formData.get('awayTeamMVPBlocker') as string,
        imageUrl: ""
    }
    // save to cosmosDb
    context.extraOutputs.set(cosmosOutput, bout);
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

app.http('getBouts', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'bouts/{year}',
    extraInputs: [cosmosInput],
    handler: getBouts
});

app.http('updateBout', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'update-bout',
    extraOutputs: [cosmosOutput],
    handler: updateBout
});

app.http('addDates', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'add-dates',
    extraOutputs: [cosmosOutput],
    handler: addDates
});
