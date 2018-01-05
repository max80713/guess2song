// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Links } from '../../api/links/links.js';
import { Tokens } from '../../api/tokens/tokens.js';
import { Auth, Api}  from '@kkbox/kkbox-js-sdk';
import async from 'async';

const getNewToken = () => new Promise((resolve, reject) => {
  const auth = new Auth('20a510010adc77366c0ac1567db4c770', '96d9067cfb629786b73df6f783ccce5c');
  auth.clientCredentialsFlow.fetchAccessToken().then((response) => {
    const token = response.data;
    token.expires_in = token.expires_in * 1000;
    token.expires_at = new Date().getTime() + token.expires_in * 1000;
    resolve(token);
  }).catch(reject);
});

Meteor.startup(() => {  
  async.forever((next) => {
    const token = Tokens.findOne();
    if (!token || new Date() > token.expires_at ) {
      getNewToken().then((newToken) => {
        Tokens.upsert({}. newToken, (error, result) => {
          if (error) {
            next(error)
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
