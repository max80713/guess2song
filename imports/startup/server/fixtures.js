// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Links } from '../../api/links/links.js';
import { Tokens } from '../../api/tokens/tokens.js';
import { Tracks } from '../../api/tracks/tracks.js';
import { Auth, Api}  from '@kkbox/kkbox-js-sdk';
import async from 'async';
import moment from 'moment';

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
      console.log(new Date(), 'updating token...');
      getNewToken().then((newToken) => {
        Tokens.upsert({}. newToken, (error, result) => {
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
  let first = true;
  async.forever((next) => {
    Meteor.setTimeout(next, moment().endOf('day') - moment());
    if (first) {
      first = false;
      return;
    };
    console.log(new Date(), 'updating tracks...');
    const accessToken = Tokens.findOne().access_token;
    const api = new Api(accessToken);
    api.chartFetcher.setPlaylistID('0kTVCy_kzou3AdOsAc').fetchTracks().then((response) => {
      const tracks = response.data.data;
      Tracks.remove({});
      async.each(tracks, (track, callback) => Tracks.insert(track, callback), (error) => {
        if (error) {
          next(error);
          return;
        }
      });
    }).catch(next);
  }, console.log);
});
