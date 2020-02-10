
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';

const app = express();
app.use(cors())


const schema = gql`
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    
    # Query types for the user schema
    # 
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]
    }
`;


let users = {
  1: {
    id: '1',
    username: 'Henrik Grönvall',
    firstName: 'Henrik',
    lastName: 'Grönvall'
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    firstName: 'Dave',
    lastName: 'Davids'
  },
};

const me = users[1];

const resolvers = {
  // Default resolver
  Query: {
    users: () => {
      // Returns an array of enumerable properties of an object
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: () => {
      return me;
    },
  },

  // Field level resolvers - is executed before default query resolvers
  // Can be used to override default query resolvers
  // or add computation such as this example, concatenate firstName and lastName into a fullName
  User: {
    username: parent => {
      return parent.username
    },
    fullName: parent => {
      return `${parent.firstName} ${parent.lastName}`
    }
  },
};


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });
app.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
});
