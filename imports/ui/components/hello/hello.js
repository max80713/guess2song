import './hello.html';
import '../loader/loader.html';

Template.hello.onCreated(function helloOnCreated() {
  this.playlists = new ReactiveVar([]);
  Meteor.call('getPlaylists', (error, result) => {
    this.playlists.set(result);
  });
});

Template.hello.helpers({
  playlists() {
    return Template.instance().playlists.get();
  },
});

Template.hello.events({
  'click .card'() {
    FlowRouter.go(`/${this.id}`);
  },
});
