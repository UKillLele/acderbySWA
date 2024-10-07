import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Guid } from 'guid-typescript';
import { ApiError, CatalogObject, Client, Environment, UpdateOrderRequest, Order } from 'square';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

export async function getCatalog(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    if (request != null){
        const _client = new Client({
            accessToken: process.env.SquareAccessToken,
            environment: Environment.Production
        })
        let categories: CatalogObject[];
        try
        {
          const response = await _client.catalogApi.listCatalog("", "CATEGORY");
          categories = response.result.objects;
        }
        catch (error)
        {
          if (error instanceof ApiError) {
            return {
                status: 500,
                jsonBody: error
            }
          }
        }

        const category: string = request.query.get("category");

        let items: CatalogObject[];
        try
        {
          const response = await _client.catalogApi.searchCatalogItems({ categoryIds: [categories.find(x => x.categoryData?.name == (category == "tickets" ? "Presale" : "Merchandise"))?.id]});
          items = response.result.items;
        }
        catch (error)
        {
          if (error instanceof ApiError) {
            return {
                status: 500,
                jsonBody: error
            }
          }
        }

        try
        {
          const response = await _client.catalogApi.listCatalog("", "IMAGE");
          items = items.concat(response.result.objects);
        }
        catch (error)
        {
          if (error instanceof ApiError) {
            return {
                status: 500,
                jsonBody: error
            }
          }
        }
        return {
            status: 200,
            body: JSON.stringify(items, (_, v) => typeof v === 'bigint' ? v.toString() : v)
        };
      }
    else {
        return {
            status: 404,
            jsonBody: 'Catalog not found'
        };
    }
}

export async function getOrder(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    if (request) {
        const id = request.params.id;
        const _client = new Client({
            accessToken: process.env.SquareAccessToken,
            environment: Environment.Production
        });
        try
        {
            const response = await _client.ordersApi.retrieveOrder(id);
            return {
                status: 200,
                body: JSON.stringify(response.result.order, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            }
        }
        catch (error)
        {
          if (error instanceof ApiError) {
            return {
                status: 500,
                jsonBody: error
            }
          }
        }
    } else {
        return {
            status: 404,
            jsonBody: 'Order not found'
        };
    }
}

export async function updateOrder(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const order = await request.json() as OrderAddItemRequest;
    if (order) {
        const _client = new Client({
            accessToken: process.env.SquareAccessToken,
            environment: Environment.Production
        });
        const lineItems = [];
        const fieldsToClear = [];
        order.items.forEach(item => {
            const quantity = parseInt(item.quantity);
            if(item.uid) {
                if(quantity > 0) {
                    lineItems.push({ uid: item.uid, quantity: item.quantity })
                } else {
                    fieldsToClear.push(`lin_items[${item.uid}]`);
                }
            } else {
                lineItems.push({ catalogObjectId: item.lineItemId, quantity: item.quantity })
            }
        });
        const updatedOrder: UpdateOrderRequest = {
            order: {
                lineItems,
                pricingOptions: { autoApplyDiscounts: true },
                locationId: process.env.SquareLocationId
            },
            fieldsToClear,
            idempotencyKey:  Guid.create().toString()
        }
        if(order.version) updatedOrder.order.version = order.version;
        try {
            if (order.orderId) {
                const response = await _client.ordersApi.updateOrder(order.orderId, updatedOrder);
                return {
                    status: 200,
                    body: JSON.stringify(response.result.order, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                }
            } else {
                const response = await _client.ordersApi.createOrder(updatedOrder);
                return {
                    status: 200,
                    body: JSON.stringify(response.result.order, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                }
            }
        } catch (error)
        {
          if (error instanceof ApiError) {
            return {
                status: 500,
                jsonBody: error
            }
          }
        }
    } else {
        return {
            status: 404,
            jsonBody: 'Order not found'
        };
    }
}

export async function addFulfillment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const req = await request.json() as AddFulfillmentRequest;
    if (req) {
        const _client = new Client({
            accessToken: process.env.SquareAccessToken,
            environment: Environment.Production
        });
        const fulfillments = [];
        const serviceCharges = [];
        if (req.fulfillment === "shipment") {
            serviceCharges.push({ name: "Shipping", amountMoney: { amount: 600, currency: "USD"}, calculationPhase: "TOTAL_PHASE" });
            fulfillments.push({
                type: "SHIPMENT",
                uid: req.fulfillmentUid ?? null,
                shipmentDetails: {
                    recipient: {
                        displayName: req.displayName,
                        emailAddress: req.emailAddress,
                        phoneNumber: req.phoneNumber,
                        address: {
                            addressLine1: req.address1,
                            addressLine2: req.address2,
                            locality: req.state,
                            sublocality: req.city,
                            postalCode: req.zipcode
                        }
                    }
                }
            });
        } else {
            fulfillments.push({
                type: "PICKUP",
                uid: req.fulfillmentUid ?? null,
                pickupDetails: {
                    recipient: {
                        displayName: req.displayName,
                        emailAddress: req.emailAddress,
                        phoneNumber: req.phoneNumber
                    },
                    pickupAt: "3000-01-01"
                }
            });
        }

        const updatedOrder: UpdateOrderRequest = {
            order: {
                version: req.version,
                fulfillments,
                serviceCharges,
                state: "OPEN",
                locationId: process.env.SquareLocationId
            },
            idempotencyKey: Guid.create().toString()
        }

        try
        {
            let response = await _client.ordersApi.updateOrder(req.orderId, updatedOrder);
            return {
                status: 200,
                body: JSON.stringify(response.result.order, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            }
        }
        catch (error)
        {
          if (error instanceof ApiError) {
            return {
                status: 500,
                jsonBody: error
            }
          }
        }
    } else {
        return {
            status: 404,
            jsonBody: 'Order not found'
        };
    }
}

export async function processPayment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const req = await request.json() as PaymentRequest;
    if (req) {
        const _client = new Client({
            accessToken: process.env.SquareAccessToken,
            environment: Environment.Production
        });
        const response = await _client.paymentsApi.createPayment({
            sourceId: req.sourceId,
            orderId: req.order?.id,
            amountMoney: req.order?.netAmountDueMoney,
            idempotencyKey: Guid.create().toString()
        });
        try{
            const fulfillment = req.order?.fulfillments[0]?.type ==="PICKUP" ? req.order.fulfillments[0].pickupDetails.recipient : req.order.fulfillments[0].shipmentDetails.recipient;
            if (fulfillment) {
                let code: string;
                await QRCode.toDataURL(req.order?.id)
                    .then((url) => {
                        code = url;
                    })
                    .catch((err) => {
                        context.error(err);
                    });
                let items: string = '';
                const discount = parseInt(req.order?.totalDiscountMoney?.amount?.toString());
                const charge = parseInt(req.order?.totalServiceChargeMoney?.amount?.toString());
                const total = parseInt(req.order?.totalMoney?.amount?.toString());
                if (req.order)
                {
                    req.order?.lineItems.forEach(item => {
                        const base = parseInt(item.basePriceMoney.amount.toString());
                        items += `<li>${item.name} x ${item.quantity} @ $${base / 100}</li>`;
                    });
                }
                var emailTop = "<!DOCTYPE html><html><head><meta charset='utf-8' /><title></title></head><body><div style='padding: 10px'>";
                var thanks = "<p>Thank you for supporting ACRD! Here's your order info:</p>";
                var emailBottom = "<p>Sincerly,</p><p>UKillLele</p></div></body></html>";
                var html = emailTop;
                html += `<p>${fulfillment.displayName},</p>`;
                html += thanks;
                html += `<ul>${items}</ul>`;
                html += req.order?.totalDiscountMoney != null && discount > 0 ? `<p>Discounts: $${discount / 100}</p>` : '';
                html += req.order?.totalServiceChargeMoney != null && charge > 0 ? `<p>Shipping: $${charge / 100}</p>` : '';
                html += `<p style='font-weight: bold'>Total: $${total / 100}</p>`;
                html += `<p>order #: ${req.order?.id}</p>`;
                html += "<img src='cid:QRCode' height='300' width='300' alt='QRCode.png' />";
                html += emailBottom;
                
                const transporter = nodemailer.createTransport({
                    name: 'acderby.com',
                    host: process.env.MailServer,
                    port: Number(process.env.MailPort),
                    secure: true,
                    auth: {
                        user: process.env.EmailUserName,
                        pass: process.env.EmailPassword
                    },
                    logger: true
                });
                await transporter.sendMail({
                    from: "info@acderby.com",
                    to: fulfillment.emailAddress,
                    subject: "Assassination City Roller Derby Purchase Receipt",
                    text: html.replace("<[^>]+?>", ""),
                    html: html,
                    attachments: [{
                        filename: 'QRCode.png',
                        path: code,
                        cid: 'QRCode'
                    }]
                });
            }
        } catch(err)
        {
            return {
                status: 200,
                jsonBody: 'Payment received but email receipt failed to generate. Please contact info@acderby.com'
            }
        }
        finally {
            return {
                status: 200,
                body: JSON.stringify(response.result.payment, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            }
        }
    } else {
        return {
            status: 404,
            jsonBody: 'Payment not found'
        };
    }
}

app.http('getCatalog', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'catalog',
    handler: getCatalog,
});

app.http('getOrder', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'order/{id}',
    handler: getOrder,
});

app.http('updateOrder', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'update-order',
    handler: updateOrder,
});

app.http('addFulfillment', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'add-fulfillment',
    handler: addFulfillment,
});

app.http('processPayment', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'process-payment',
    handler: processPayment,
});

class OrderAddItemRequest {
    orderId: string;
    version: number;
    items: OrderItem[];
}

class OrderItem {
    lineItemId: string;
    uid: string;
    quantity: string;
}

class RequestAddress {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipcode: string;
}

class AddFulfillmentRequest extends RequestAddress {
    displayName: string;
    emailAddress: string;
    phoneNumber: string;
    version: number;
    orderId: string;
    fulfillment: string;
    fulfillmentUid: string;
}

class PaymentRequest {
    sourceId: string;
    order: Order;
}
