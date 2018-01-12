import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

import FB from 'fb';

import { Games } from './games/games.js';
import { Playlists } from './playlists/playlists.js';
import { Tracks } from './tracks/tracks.js';

Meteor.methods({
  'getPlaylists'() {
    return Playlists.find().fetch();
  },
  'getTracks'(playlistId) {
    return Tracks.find({ playlist_id: playlistId }).fetch();
  },
  'getPictureUrl'() {
    const user = Meteor.user();
    if (!user) return '';
    const fbAccessToken = user.services.facebook.accessToken;
    FB.setAccessToken(fbAccessToken);
    const fbAPI = () => new Promise((resolve, reject) => {
      FB.api('/me?fields=picture', 'get', (res) => {
        if(!res || res.error) {
          reject(!res ? 'error occurred' : res.error);
          return;
        }
        resolve(res.picture.data.url);
      });
    });
    return Promise.await(fbAPI());
  },
});
