import { Meteor } from 'meteor/meteor';
import { Tracks } from './tracks/tracks.js';
import { Games } from './games/games.js';

Meteor.methods({
  'createGame'() {
    // Games.insert({ user_id: this.userId });
    return traks = Tracks.aggregate([ { $sample: { size: 4 } } ]);
  },
});
