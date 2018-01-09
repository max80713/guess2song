import './game.html';
import Random from 'random-js';

Template.game.onCreated(function gameOnCreated() {
  this.tracks = new ReactiveVar();
  this.options = new ReactiveVar();
  this.random = new Random();
  const playlistId = FlowRouter.getParam('playlistId');
  Meteor.call('getTracks', playlistId, (error, result) => {
    this.tracks.set(result);    
  });
});

Template.game.onRendered(function gameOnRendered() {
  this.autorun(() => {
    const tracks = this.tracks.get();
    if (!tracks) return;

    const options = this.random.sample(tracks, 4);
    this.options.set(options);

    const track = this.random.pick(options);
    this.trackId = track.id;

    let iframe;
    if (!this.find('iframe')) {
      iframe = document.createElement('iframe');
      this.find('.track').append(iframe);
    }
    iframe.src = `https://widget.kkbox.com/v1/?id=${track.id}&type=song&terr=JP&lang=JA&autoplay=true`;
  });
});

Template.game.helpers({
  options() {
    return Template.instance().options.get();
  },
});