import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

import { Api } from '@kkbox/kkbox-js-sdk';
import FB from 'fb';

import { Games } from './games/games.js';
import { Tokens } from './tokens/tokens.js';
import { Playlists } from './playlists/playlists.js';
import { Tracks } from './tracks/tracks.js';

const fetchCharts = (api) => new Promise(resolve => api.chartFetcher.fetchCharts().then(response => resolve(response.data.data)));
const fetchTracks = (api, playlistId) => new Promise(resolve => api.chartFetcher.setPlaylistID(playlistId).fetchTracks().then(response => resolve(response.data.data)));

// playlists.forEach((playlist) => {
//   if (!playlist.champion_id) return;
//   const champion = Meteor.users.findOne(playlist.champion_id);
//   if (!champion) return;
//   playlist.champion_name = champion.profile.name;
//   const fbAccessToken = champion.services.facebook.accessToken;
//   FB.setAccessToken(fbAccessToken);
//   const fbAPI = () => new Promise((resolve, reject) => {
//     FB.api('/me?fields=picture', 'get', (res) => {
//       if(!res || res.error) {
//         reject(!res ? 'error occurred' : res.error);
//         return;
//       }
//       resolve(res.picture.data.url);
//     });
//   });
//   playlist.champion_picture = Promise.await(fbAPI())
// });

Meteor.methods({
  'getPlaylists'() {
    const token = Tokens.findOne();
    const api = new Api(token.access_token);
    const playlists = Promise.await(fetchCharts(api));
    return playlists;
  },
  'getTracks'(playlistId) {
    const token = Tokens.findOne();
    const api = new Api(token.access_token);
    const tracks = Promise.await(fetchTracks(api, playlistId));
    return tracks;
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
  'updateChampion'(playlistId, score) {
    if (!this.userId) return;
    const playlist = Playlists.findOne({ id: playlistId });
    if (!playlist) return;
    if (!playlist.champion_score || score > playlist.champion_score) {
      return Playlists.update({ id: playlistId}, { $set: { champion_id: this.userId, champion_score: score } });
    }
    return;
  }
});
