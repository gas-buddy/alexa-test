alexa-test
==========

alexa-test is a tool to make testing Alexa skills easier. It constructs simulated requests,
manages mocked requests BACK to the Alexa API and executes handlers. It uses a fluent interface
ala superagent/supertest with one key difference - at every step a new object is returned.
Because of this, you can build "partial" test specifications and then fork a variety of tests
that vary elements (such as slot values). To execute a test, you call `.test()` which will
return a promise. which resolves to the response from the handler (or throws an exception).

Sample Usage
============

```
import tap from 'tap';
import alexa from '@gasbuddy/alexa-test';

tap.test('test HelloIntent', async (t) => {
  // You would start your app here, however you do that
  const app = await startMyExpressAlexaApp();
  const result = await alexa(app, '/alexa')
    .intent('HelloIntent')
    .slot('planet', 'earth', alexa.CONFIRMATION.CONFIRMED)
    .test();
  t.strictEquals(alexa.speech(result), 'Hello Earth', 'Should say the right thing');
});

```