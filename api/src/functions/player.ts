import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from '@azure/functions';

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
    connection: 'CosmosDbConnectionString',
    partitionKey: '{id}'
});

export async function getPlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const players = <Person[]>context.extraInputs.get(cosmosInput);
    if (!players) {
        return {
            status: 404,
            body: 'Players not found',
        };
    } else {
        return {
            jsonBody: players[0],
        };
    }
}

app.http('getPlayer', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'player/{id}',
    extraInputs: [cosmosInput],
    handler: getPlayer,
});
