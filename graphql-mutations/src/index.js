import { GraphQLServer } from 'graphql-yoga';
import mock from './mock';
import { Query, Mutation, Post, User, Comment } from './resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    Comment,
    User,
  },
  context: {
    mock,
  },
});

server.start(() => {
  console.log('The server is up!');
});
