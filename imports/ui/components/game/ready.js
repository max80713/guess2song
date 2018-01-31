import './ready.html';
import { Template } from 'meteor/templating';

Template.ready.onCreated(function readyOnCreated() {
  this.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
});

Template.ready.onRendered(function readyOnRendered() {
  const { init } = this.data;
  this.$('.message').one(this.animationEnd, () => {
    this.$('.message').addClass('animated slideOutRight').one(this.animationEnd, () => {
      init();
      Blaze.remove(this.view);
    });
  });
});

Template.ready.events({
  'click .message'() {
    return false;
  }
})
