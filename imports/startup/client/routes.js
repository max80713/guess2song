import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

import '../../ui/layouts/body/body.js';
import '../../ui/components/login/login.js';
import '../../ui/components/playlists/playlists.js';
import '../../ui/components/game/game.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'login' });
  },
});

FlowRouter.route('/playlists', {
  name: 'App.home',
  // triggersEnter: [(context, redirect) => {
  //   if (!Meteor.user()) redirect('/');
  // }],
  action() {
    BlazeLayout.render('App_body', { main: 'playlists' });
  },
});

FlowRouter.route('/playlists/:playlistId', {
  name: 'App.home',
  // triggersEnter: [(context, redirect) => {
  //   if (!Meteor.user()) redirect('/');
  // }],
  action() {
    BlazeLayout.render('App_body', { main: 'game' });
  },
});
