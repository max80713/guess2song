import './body.html';

Template.App_body.onRendered(function bodyOnRendered() {
  this.$('.modal.help').modal();
});

Template.App_body.events({
  'click a.help'(event, instance) {
    instance.$('.modal.help').modal('open');
  },
  'click a.exit'() {
    FlowRouter.go('/');
  },
})
