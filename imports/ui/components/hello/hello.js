import './hello.html';
import { Random } from 'meteor/random';

Template.hello.onCreated(function helloOnCreated() {
  this.playlists = new ReactiveVar([]);
  Meteor.call('getPlaylists', (error, result) => {
    this.playlists.set(result);
  })
});

Template.hello.onRendered(function helloOnRendered() {
  // this.autorun(() => {
  //   this.percent = 0;
  //   Meteor.clearInterval(this.progrss);
  //   Meteor.clearTimeout(this.countDown);
    
  //   const games = this.games.get();
  //   if (games > 5) {
  //     this.games.set(0);
  //     this.options.set();
  //     if (this.find('iframe')) this.find('.track').removeChild(this.find('iframe'));
  //     return;
  //   }
  //   if (games > 0) {
  //     Meteor.call('createGame', (error, result) => {
  //       this.options.set(result);
  //       const track = Random.choice(result);
  //       const trackId = track.id;
  //       this.trackId = trackId;
  //       if (this.find('iframe')) this.find('.track').removeChild(this.find('iframe'));
  //       var iframe = document.createElement('iframe');
  //       iframe.src = `https://widget.kkbox.com/v1/?id=${trackId}&type=song&terr=JP&lang=JA&autoplay=true`;
  //       this.find('.track').prepend(iframe);
        
  //       this.progrss = Meteor.setInterval(() => {
  //         this.percent += 1 / 30;
  //         this.$('.progress').progress('set percent', this.percent);
  //       }, 10);
        
  //       this.countDown = Meteor.setTimeout(() => {
  //         this.games.set(this.games.get() + 1);
  //       }, 30000);
  //     });
  //   }
  // });
});

Template.hello.helpers({
  playlists() {
    return Template.instance().playlists.get();
  },
});

Template.hello.events({
  'click .ui.card'() {
    FlowRouter.go(`/${this.id}`);
  },
});
