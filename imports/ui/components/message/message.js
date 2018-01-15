import './message.html';
import { Template } from 'meteor/templating';

Template.message.onCreated(function messageOnCreated() {
  this.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
});

Template.message.onRendered(function messageOnRendered() {
  const { init } = this.data;
  this.$('.message').one(this.animationEnd, () => {
    this.$('.message').addClass('animated slideOutRight').one(this.animationEnd, () => {
      init();
      Blaze.remove(this.view);
    });
  });
});

Template.message.events({
  'click .message'() {
    return false;
  }
})
