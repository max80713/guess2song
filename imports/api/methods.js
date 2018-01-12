import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

import FB from 'fb';

import { Games } from './games/games.js';
import { Playlists } from './playlists/playlists.js';
import { Tracks } from './tracks/tracks.js';

Meteor.methods({
  'getPlaylists'() {
    const playlists = Playlists.find().fetch();
    playlists.forEach((playlist) => {
      if (!playlist.champion_id) return;
      const champion = Meteor.users.findOne(playlist.champion_id);
      if (!champion) return;
      playlist.champion_name = champion.profile.name;
      const fbAccessToken = champion.services.facebook.accessToken;
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
      playlist.champion_picture = Promise.await(fbAPI())
    });
    return playlists;
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
