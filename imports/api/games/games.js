import { Mongo } from 'meteor/mongo';

const Games = new Mongo.Collection('games');

Games.schema = new SimpleSchema({
  user_id: { type: SimpleSchema.RegEx.Id },
  competitor_id: { type: SimpleSchema.RegEx.Id },
  results: { type: [Number] },
})

Games.attachSchema(Games.schema);

export default Games;
