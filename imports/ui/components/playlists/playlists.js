import './playlists.html';
import './loader.html';

Template.playlists.onCreated(function playlistsOnCreated() {
  this.playlists = new ReactiveVar([]);
  Meteor.call('getPlaylists', (error, result) => {
    this.playlists.set(result);
  });
});

Template.playlists.helpers({
  playlists() {
    return Template.instance().playlists.get();
  },
});

Template.playlists.events({
  'click .card'() {
    FlowRouter.go(`/playlists/${this.id}`);
  },
});
