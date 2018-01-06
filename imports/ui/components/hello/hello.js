import './hello.html';
import { Random } from 'meteor/random';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  this.options = new ReactiveVar();
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  options() {
    return Template.instance().options.get();
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
    Meteor.call('createGame', (error, result) => {
      instance.options.set(result);
      const track = Random.choice(result);
      const trackId = track.id;
      console.log(track);
      if (instance.find('iframe')) instance.find('.track').removeChild(instance.find('iframe'));
      var iframe = document.createElement('iframe');
      // iframe.style.display = "none";
      iframe.src = `https://widget.kkbox.com/v1/?id=${trackId}&type=song&terr=JP&lang=JA&autoplay=true`;
      instance.find('.track').append(iframe);
    });
  },
});
