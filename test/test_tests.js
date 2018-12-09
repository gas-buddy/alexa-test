import tap from 'tap';
import express from 'express';
import bodyParser from 'body-parser';
import { SkillBuilders } from 'ask-sdk-core';
import alexa from '../src';

const HelloWorldHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorld';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Hello World')
      .getResponse();
  },
};

tap.test('test_expansions', async (tester) => {
  const app = express();
  app.use(bodyParser.json());

  const skill = SkillBuilders.custom()
    .addRequestHandlers(HelloWorldHandler)
    .create();

  app.post('/alexa', async (req, res) => {
    res.json(await skill.invoke(req.body));
  });

  const response = await alexa(app, '/alexa')
    .intent('HelloWorld')
    .slot('testSlot', 'foobar', alexa.CONFIRMATION.CONFIRMED)
    .test();
  tester.strictEquals(alexa.speech(response), 'Hello World', 'Should say hello world.');
});
