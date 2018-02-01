import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

import { Api } from '@kkbox/kkbox-js-sdk';
import FB from 'fb';

import { Tokens } from './tokens/tokens.js';
import { Playlists } from './playlists/playlists.js';

const fetchCharts = (api) => new Promise(resolve => api.chartFetcher.fetchCharts().then(response => resolve(response.data.data)));
const fetchTracks = (api, playlistId) => new Promise(resolve => api.chartFetcher.setPlaylistID(playlistId).fetchTracks().then(response => resolve(response.data.data)));
const fetchFbPicture = (accessToken) => new Promise((resolve, reject) => {
  FB.setAccessToken(accessToken);
  FB.api('/me?fields=picture', 'get', (res) => {
    if(!res || res.error) {
      reject(!res ? 'error occurred' : res.error);
      return;
    }
    resolve(res.picture.data.url);
  });
});

Meteor.methods({
  'getPlaylists'() {
    const token = Tokens.findOne();
    const api = new Api(token.access_token);
    const playlists = Promise.await(fetchCharts(api));
    playlists.forEach((playlist) => {
      const playlistDocument = Playlists.findOne({ id: playlist.id });
      if (!playlistDocument) return;
      if (!playlistDocument.champion_id) return;
      const champion = Meteor.users.findOne(playlistDocument.champion_id);
      if (!champion) return;
      playlist.champion_score = playlistDocument.champion_score;
      playlist.champion_name = champion.profile.name;
      const fbAccessToken = champion.services.facebook.accessToken;
      playlist.champion_picture = Promise.await(fetchFbPicture(fbAccessToken));
    });
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
    return Promise.await(fetchFbPicture(fbAccessToken));
  },
  'updateChampion'(playlistTitle, score) {
    if (!this.userId) return;
    const playlist = Playlists.findOne({ title: playlistTitle });
    if (!playlist) return;
    if (!playlist.champion_score || score > playlist.champion_score) {
      return Playlists.update({ title: playlistTitle}, { $set: { champion_id: this.userId, champion_score: score } });
    }
    return;
  }
});
