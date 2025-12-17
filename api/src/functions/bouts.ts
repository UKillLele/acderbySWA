import { app, HttpRequest, HttpResponseInit, input, InvocationContext, output } from '@azure/functions';

interface Bout {
    id: string,
    name: string,
    date: string,
    homeTeam: string,
    homeTeamScore: string,
    homeTeamMVPJammer: string,
    homeTeamMVPBlocker: string,
    awayTeam: string,
    awayTeamScore: string,
    awayTeamMVPJammer: string,
    awayTeamMVPBlocker: string,
    imageUrl: string
}

const cosmosInput = input.cosmosDB({
    databaseName: 'acderby',
    containerName: 'bouts',
    connection: 'CosmosDbConnectionString'
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'acderby',
    containerName: 'bouts',
    connection: 'CosmosDbConnectionString',
    createIfNotExists: false
});

export async function getBouts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    cosmosInput.sqlQuery = 'SELECT * from c';
    const bouts = <Bout[]>context.extraInputs.get(cosmosInput);
    context.log(bouts)
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

app.http('getBouts', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'bouts',
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
