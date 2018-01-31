import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import Random from 'random-js';

import './game.html';
import './ready.js';
import './star.js';

Template.game.onCreated(function gameOnCreated() {
  this.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  this.records = new ReactiveVar();
  this.tracks = new ReactiveVar();
  this.pictureUrl = new ReactiveVar();
  this.track = new ReactiveVar();
  this.options = new ReactiveVar();
  this.time = new ReactiveVar();
  this.random = new Random();
  this.init = () => {
    this.time.set(30);
    this.records.set([]);
  };
  const playlistId = FlowRouter.getParam('playlistId');
  Meteor.call('getTracks', playlistId, (error, result) => {
    this.tracks = result;
    Blaze.renderWithData(Template.ready, { init: this.init }, this.firstNode);
  }); 
  Meteor.call('getPictureUrl', (error, result) => {
    this.pictureUrl.set(result);
  })
});

Template.game.onRendered(function gameOnRendered() {
  this.$('.result').modal({
    dismissible: false,
  });
  this.autorun(() => {
    const records = this.records.get();
    if (!records) return;

    const tracks = this.tracks;
    const options = this.random.sample(tracks, 4);
    this.options.set([]);
    Meteor.defer(() => this.options.set(options));

    const track = this.random.pick(options);
    this.track.set(track);
  });
  this.autorun(() => {
    const time = this.time.get();
    if (time === 30) {
      this.timer = Meteor.setInterval(() => this.time.set(this.time.get() - 1), 1000);
    } else if (time === 0) {
      const records = this.records.get();
      const score = records.filter(record => record).length - records.filter(record => !record).length;
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
    const option = instance.$('li.option');
    if (option.hasClass('flash')) return;
    const options = instance.options.get();
    const trackId = instance.track.get().id;
    const trackIndex = options.findIndex(option => option.id === trackId);
    const correct = this.id === trackId;
    Blaze.renderWithData(Template.star, { correct }, instance.$('.stars')[0]);
    
    option.eq(trackIndex)
      .removeClass('animated zoomIn')
      .addClass('animated flash')
      .one(instance.animationEnd, () => {
        option.removeClass('animated zoomIn flash');
        const records = instance.records.get();
        if (correct) instance.records.set(records.concat([true]));
        else instance.records.set(records.concat([false]));
      });
  },
  'click .fixed-action-btn'() {
    FlowRouter.go('/');
  },
  'click .back'() {
    FlowRouter.go('/');
  },
  'click .again'(event, instance) {
    instance.options.set([]);
    instance.$('div.stars').empty();
    Blaze.renderWithData(Template.ready, { init: instance.init }, instance.firstNode);
  },
});

Template.game.helpers({
  score() {
    const records = Template.instance().records.get();
    if (!records) return 0;
    const rights = records.filter(record => record).length;
    const wrongs = records.filter(record => !record).length;
    return rights - wrongs;
  },
  corrects() {
    const records = Template.instance().records.get();
    if (!records) return [];
    return records.filter(record => record);
  },
  wrongs() {
    const records = Template.instance().records.get();
    if (!records) return [];
    return records.filter(record => !record);
  },
  options() {
    return Template.instance().options.get();
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
  width() {
    const time = Template.instance().time.get();
    return time ? `${time / 30 * 100}%` : 0;
  }
});