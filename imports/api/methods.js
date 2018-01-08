import { Meteor } from 'meteor/meteor';

import { Games } from './games/games.js';
import { Playlists } from './playlists/playlists.js';
import { Tracks } from './tracks/tracks.js';

Meteor.methods({
  'createGame'() {
    // Games.insert({ user_id: this.userId });
    return Tracks.aggregate([ { $sample: { size: 4 } } ]);
  },
  'getPlaylists'() {
    // Games.insert({ user_id: this.userId });
    return Playlists.find().fetch();
  },
});
