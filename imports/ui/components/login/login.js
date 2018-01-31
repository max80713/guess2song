import './login.html';
import { Template } from 'meteor/templating';

Template.login.onRendered(function loginOnRendered() {
  const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  this.$('.title').addClass('animated flip').one(animationEnd, () => {
    this.$('.title').removeClass('animated flip');
    this.$('.title').addClass('animated infinite pulse');
  });
});

Template.login.helpers({
  isMobile() {
    return /Mobi/.test(navigator.userAgent);
  }
});