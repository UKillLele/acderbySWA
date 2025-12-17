// import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

// export async function validateAddress(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
//   if (request) {
//     const address = await request.json() as Address;
    
//   }

//   return {
//       status: 404,
//       body: 'Please enter an address',
//   };
// }

// app.http('validateAddress', {
//     methods: ['POST'],
//     authLevel: 'function',
//     route: 'validate-address',
//     handler: validateAddress,
// });

// class Address
//     {
//         address1: string;
//         address2: string;
//         city: string;
//         state: string;
//         zipcode: string;
//         returnText: string;
//     }
