import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/body/body.js';
import '../../ui/components/hello/hello.js';
import '../../ui/components/game/game.js';
import '../../ui/pages/not-found/not-found.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'hello' });
  },
});

FlowRouter.route('/:playlistId', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'game' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
