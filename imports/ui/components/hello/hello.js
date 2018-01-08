import './hello.html';
import { Random } from 'meteor/random';

Template.hello.onCreated(function helloOnCreated() {
  this.options = new ReactiveVar();
  this.games = new ReactiveVar(0);
  this.score = new ReactiveVar(0);
  this.playlists = new ReactiveVar([]);
});

Template.hello.onRendered(function helloOnRendered() {
  Meteor.call('getPlaylists', (error, result) => {
    this.playlists.set(result);
  })
  this.autorun(() => {
    this.percent = 0;
    Meteor.clearInterval(this.progrss);
    Meteor.clearTimeout(this.countDown);
    
    const games = this.games.get();
    if (games > 5) {
      this.games.set(0);
      this.options.set();
      if (this.find('iframe')) this.find('.track').removeChild(this.find('iframe'));
      return;
    }
    if (games > 0) {
      Meteor.call('createGame', (error, result) => {
        this.options.set(result);
        const track = Random.choice(result);
        const trackId = track.id;
        this.trackId = trackId;
        if (this.find('iframe')) this.find('.track').removeChild(this.find('iframe'));
        var iframe = document.createElement('iframe');
        iframe.src = `https://widget.kkbox.com/v1/?id=${trackId}&type=song&terr=JP&lang=JA&autoplay=true`;
        this.find('.track').prepend(iframe);
        
        this.progrss = Meteor.setInterval(() => {
          this.percent += 1 / 30;
          this.$('.progress').progress('set percent', this.percent);
        }, 10);
        
        this.countDown = Meteor.setTimeout(() => {
          this.games.set(this.games.get() + 1);
        }, 30000);
      });
    }
  });
});

Template.hello.helpers({
  options() {
    return Template.instance().options.get();
  },
  games() {
    return Template.instance().games.get();
  },
  score() {
    return Math.round(Template.instance().score.get());
  },
  playlists() {
    return Template.instance().playlists.get();
  },
});

Template.hello.events({
  'click button.start'(event, instance) {
    instance.score.set(0);
    instance.games.set(instance.games.get() + 1);
  },
  'click button.option'(event, instance) {
    if (this.id === instance.trackId) {
      instance.score.set(instance.score.get() + 3 * (100 - instance.percent));
      instance.games.set(instance.games.get() + 1);
    }
    else instance.$(event.currentTarget).addClass('disabled');
  },
});
