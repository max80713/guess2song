import { ReactiveVar } from 'meteor/reactive-var';
import Random from 'random-js';
import ClockTimer from '../../../../client/lib/clock-timer.js';

import './game.html';
import '../message/message.js';

Template.game.onCreated(function gameOnCreated() {
  this.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  this.rights = new ReactiveVar();
  this.wrongs = new ReactiveVar();
  this.tracks = new ReactiveVar();
  this.pictureUrl = new ReactiveVar();
  this.track = new ReactiveVar();
  this.options = new ReactiveVar();
  this.time = new ReactiveVar();
  this.random = new Random();
  this.init = () => {
    this.time.set(60);
    this.rights.set();
    this.wrongs.set();
    Meteor.defer(() => {
      this.rights.set(0);
      this.wrongs.set(0);
    });
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 60000);
    const endDateString = `${endDate.getUTCMonth() + 1}/${endDate.getUTCDate()}/${endDate.getUTCFullYear()} ${endDate.getUTCHours()}:${endDate.getUTCMinutes()}:${endDate.getUTCSeconds()}`;
    const clock = new ClockTimer({
      endDate: endDateString, 
      secondsStrokeStyle: "#FCB937",
    });
  }
  const playlistId = FlowRouter.getParam('playlistId');
  Meteor.call('getTracks', playlistId, (error, result) => {
    this.tracks = result;
    Blaze.renderWithData(Template.message, { init: this.init }, this.firstNode);
  }); 
  Meteor.call('getPictureUrl', (error, result) => {
    this.pictureUrl.set(result);
  })
});

Template.game.onRendered(function gameOnRendered() {
  this.$('.result').modal({
    dismissible: false,
    ready: () => {
      this.$('.results').addClass('animated jello').one(this.animationEnd, () => {
        this.$(event.currentTarget).removeClass('animated jello');
      });
    },
  });
  this.autorun(() => {
    const rights = this.rights.get();
    const wrongs = this.wrongs.get();
    if (isNaN(rights) || isNaN(wrongs)) return;

    const tracks = this.tracks;
    const options = this.random.sample(tracks, 4);
    this.options.set(options);

    const track = this.random.pick(options);
    this.track.set(track);
  });
  this.autorun(() => {
    const time = this.time.get();
    if (time === 60) {
      this.timer = Meteor.setInterval(() => {      
        this.time.set(this.time.get() - 1);
      }, 1000);
    } else if (time === 0) {
      const score = this.rights.get() - this.wrongs.get();
      Meteor.clearInterval(this.timer);
      const playlistId = FlowRouter.getParam('playlistId');
      Meteor.call('updateChampion', playlistId, score, (error, result) => {
        this.$('.result').modal('open');
      });
    }
  });
});

Template.game.events({
  'click li.option'(event, instance) {
    if (this.id === instance.track.get().id) {
      instance.rights.set(instance.rights.get() + 1);
      instance.$('.right')
        .addClass('animated tada')
        .one(instance.animationEnd, () => {
          instance.$('.right').removeClass('animated tada');
        });
    } else {
      instance.wrongs.set(instance.wrongs.get() + 1);
      instance.$('.wrong')
        .addClass('animated tada')
        .one(instance.animationEnd, () => {
          instance.$('.wrong').removeClass('animated tada');
        });
    }
  },
  'click .fixed-action-btn'() {
    FlowRouter.go('/');
  },
  'click .back'() {
    FlowRouter.go('/');
  },
  'click .again'(event, instance) {
    Blaze.renderWithData(Template.message, { init: instance.init }, instance.firstNode);
  },
});

Template.game.helpers({
  time() {
    return Template.instance().time.get();
  },
  rights() {
    return Template.instance().rights.get();
  },
  wrongs() {
    return Template.instance().wrongs.get();
  },
  score() {
    return Template.instance().rights.get() - Template.instance().wrongs.get();
  },
  options() {
    return Template.instance().options.get();
  },
  index(index) {
    return index + 1;
  },
  pictureUrl() {
    return Template.instance().pictureUrl.get();
  },
  userName() {
    const user = Meteor.user();
    if (!user) return '';
    return user.profile.name;
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