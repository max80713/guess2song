import './game.html';
import { Random } from 'meteor/random';

Template.game.onCreated(function gameOnCreated() {
  this.tracks = new ReactiveVar([]);
  const playlistId = FlowRouter.getParam('playlistId');
  Meteor.call('getTracks', playlistId, (error, result) => {
    this.tracks.get(result);
  });
});

Template.game.helpers({
  tracks() {
    return Template.instance().tracks.get();
  },
});