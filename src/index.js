import uuid from 'uuid';
import { fromJS } from 'immutable';
import supertest from 'supertest';
import devices from './devices';

const applicationId = `amzn1.ask.skill.${uuid.v4()}`;

function protoRequest() {
  const userId = `amzn1.ask.account.${uuid.v4()}`;
  const device = devices.DEFAULT;

  return {
    version: '1.0',
    session: {
      new: true,
      sessionId: `amzn1.echo-api.session.${uuid.v4()}`,
      application: {
        applicationId,
      },
      user: {
        userId,
        permissions: {},
      },
    },
    context: {
      System: {
        application: {
          applicationId,
        },
        user: {
          userId,
          permissions: {},
        },
        device: {
          deviceId: device.deviceId,
          supportedInterfaces: {},
        },
        apiEndpoint: 'https://api.amazonalexa.com',
        apiAccessToken: 'mock-alexa-api-access-token',
      },
      Viewport: device.Viewport,
    },
    request: {
      type: 'IntentRequest',
      requestId: `amzn1.echo-api.request.${uuid.v4()}`,
      timestamp: new Date().toISOString(),
      locale: 'en-US',
      intent: {
        name: 'AMAZON.FallbackIntent',
        confirmationStatus: 'NONE',
      },
    },
  };
}

const CONFIRMATION = {
  NONE: 'NONE',
  CONFIRMED: 'CONFIRMED',
  DENIED: 'DENIED',
};

class AlexaTest {
  constructor(request, ctx) {
    this.request = request;
    this.ctx = ctx;
  }

  intent(name) {
    const newRequest = this.request.setIn(['request', 'intent', 'name'], name);
    return new AlexaTest(newRequest, this.ctx);
  }

  slot(name, value, confirmationStatus = CONFIRMATION.NONE, options = {}) {
    const newRequest = this.request.updateIn(['request', 'intent', 'slots'], (slots) => {
      const newSlots = slots || {};
      newSlots.name = {
        name,
        value,
        confirmationStatus,
        ...options,
      };
      return newSlots;
    });
    return new AlexaTest(newRequest, this.ctx);
  }

  async test() {
    const { body } = await supertest(this.ctx.app)
      .post(this.ctx.path)
      .send(this.request.toJS());
    return body;
  }
}

export default function alexa(app, path) {
  return new AlexaTest(fromJS(protoRequest()), { app, path });
}

alexa.CONFIRMATION = CONFIRMATION;

Object.assign(alexa, {
  speech(result) {
    const ssml = result.response?.outputSpeech?.ssml;
    if (!ssml) {
      return null;
    }
    const match = ssml.match(/^<speak>(.*)<\/speak>$/);
    return match?.[1];
  },
});
