import { Meteor } from 'meteor/meteor';

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
});
