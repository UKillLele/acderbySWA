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
    sqlQuery: 'SELECT * FROM players where exists(select value t from t in players.teams where t.id = {teamId})',
    connection: 'CosmosDbConnectionString',
});

export async function getPlayers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const players = <Person[]>context.extraInputs.get(cosmosInput);
    if (!players) {
        return {
            status: 404,
            body: 'Players not found',
        };
    } else {
        return {
            body: JSON.stringify(players),
        };
    }
}

app.http('getPlayers', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'players/{teamId}',
    extraInputs: [cosmosInput],
    handler: getPlayers,
});
