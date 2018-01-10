import { Meteor } from 'meteor/meteor';

import async from 'async';
import moment from 'moment';
import { Auth, Api } from '@kkbox/kkbox-js-sdk';

import { Playlists } from '../../api/playlists/playlists.js';
import { Tokens } from '../../api/tokens/tokens.js';
import { Tracks } from '../../api/tracks/tracks.js';

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
  async.forever((next) => {
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
  let first = true;
  async.forever((next) => {
    Meteor.setTimeout(next, moment().endOf('day') - moment());
    if (first && Playlists.find().count() > 0 && Tracks.find().count() > 0) {
      first = false;
      return;
    };
    console.log(new Date(), 'updating playlists & tracks...');
    const accessToken = Tokens.findOne().access_token;
    const api = new Api(accessToken);
    api.chartFetcher.fetchCharts().then((response) => {
      const playlists = response.data.data;
      Playlists.remove({});
      async.each(playlists, (playlist, callback) => Playlists.insert(playlist, callback), (error) => {
        if (error) {
          next(error);
          return;
        }
        async.each(playlists, (playlist, callback) => {
          api.chartFetcher.setPlaylistID(playlist.id).fetchTracks().then((response) => {
            Tracks.remove({});  
            const tracks = response.data.data;
            tracks.playlist_id = playlist.id;
            async.each(tracks, (track, callback) => Tracks.insert(track, callback), (error) => {
              if (error) {
                next(error);
                return;
              }
            });
          }).catch(next);
        }, (error) => {
          if (error) {
            next(error);
            return;
          }
        });
      });
    }).catch(next);
  }, console.log);
});
