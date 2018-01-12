import './game.html';
import Random from 'random-js';

Template.game.onCreated(function gameOnCreated() {
  this.tracks = new ReactiveVar();
  this.pictureUrl = new ReactiveVar();
  this.track = new ReactiveVar();
  this.options = new ReactiveVar();
  this.time = new ReactiveVar(60);
  this.score = new ReactiveVar();
  this.random = new Random();
  const playlistId = FlowRouter.getParam('playlistId');
  Meteor.call('getTracks', playlistId, (error, result) => {
    this.tracks = result;   
    this.score.set(0); 
    this.timer = Meteor.setInterval(() => {      
      this.time.set(this.time.get() - 1);
    }, 1000);
  }); 
  Meteor.call('getPictureUrl', (error, result) => {
    this.pictureUrl.set(result);
  })
});

Template.game.onRendered(function gameOnRendered() {
  this.autorun(() => {
    const score = this.score.get();
    if (isNaN(score)) return;

    const tracks = this.tracks;
    const options = this.random.sample(tracks, 4);
    this.options.set(options);
    Meteor.defer(() => {
      Materialize.showStaggeredList('.options');
    });

    const track = this.random.pick(options);
    this.track.set(track);
  });
  this.autorun(() => {
    const time = this.time.get();
    if (time === 0) {
      Meteor.clearInterval(this.timer);
    }
  });
});

Template.game.events({
  'click li.option'(event, instance) {
    const score = instance.score.get();
    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    if (this.id === instance.track.get().id) {
      instance.$(event.currentTarget).addClass('animated tada').one(animationEnd, () => {
        instance.$(event.currentTarget).removeClass('animated tada');
        instance.score.set(score + 1);
      });
    }
    else {
      instance.$(event.currentTarget).addClass('animated shake').one(animationEnd, () => {
        instance.$(event.currentTarget).removeClass('animated shake');
        instance.score.set(score - 1);
      });
    }
  }
});

Template.game.helpers({
  time() {
    return Template.instance().time.get();
  },
  score() {
    return Template.instance().score.get();
  },
  options() {
    return Template.instance().options.get();
  },
  name() {
    return this.name.replace(/\(.*\)/g, '');
  },
  trackSrc() {
    const track = Template.instance().track.get();
    return track ? `https://widget.kkbox.com/v1/?id=${track.id}&type=song&terr=JP&lang=JA&autoplay=true` : '';
  },
  trackCover() {
    const track = Template.instance().track.get();
    return track ? track.album.images[2].url : '';
  },
});