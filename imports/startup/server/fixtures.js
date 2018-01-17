import { Meteor } from 'meteor/meteor';

import forever from 'async/forever';
import { Auth } from '@kkbox/kkbox-js-sdk';

import { Tokens } from '../../api/tokens/tokens.js';

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

Meteor.startup(() => {
  forever((next) => {
    const token = Tokens.findOne();
    if (!token || new Date() > token.expires_at ) {
      console.log(new Date(), 'updating token...');
      getNewToken().then((newToken) => {
        Tokens.upsert({}, newToken, (error, result) => {
          if (error) {
            next(error);
            return;
          }
          Meteor.setTimeout(next, newToken.expires_in);
        });
      }).catch(next);
    } else {
      Meteor.setTimeout(next, token.expires_at - new Date());
    }
  }, console.log);
});
