import { Meteor } from 'meteor/meteor';
import forever from 'async/forever';
import { Auth } from '@kkbox/kkbox-js-sdk';

import { Tokens } from '../../api/tokens/tokens.js';

Meteor.startup(() => {
  const { KKBOX_API_CLIENT_ID: clienId, KKBOX_API_CLIENT_SECRET: clientSecret } = process.env;
  const auth = new Auth(clienId, clientSecret);
  const getNewToken = () => new Promise((resolve, reject) => {
    auth.clientCredentialsFlow.fetchAccessToken().then((response) => {
      // TODO: Handle NON-200 response
      const token = response.data;
      token.expires_in = token.expires_in * 1000;
      token.expires_at = new Date().getTime() + token.expires_in * 1000;
      resolve(token);
    }).catch(reject);
  });
  forever((next) => {
    console.log(new Date(), 'updating token...');
    getNewToken().then((newToken) => {
      Tokens.upsert({}, newToken, (error, result) => {
        if (error) {
          next(error);
          return;
        }
        Meteor.setTimeout(next, 2147483647);
      });
    }).catch(next);
  }, console.log);
});
