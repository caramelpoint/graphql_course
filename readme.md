# Notes GraphQL course

## Type of request

* Query
* Mutation
* Suscription

## Features

* Self documentation
* Expose and aplication schema
* GraphQL playground

### Queries

Example

``` graphql
query {
  courseName
  couseInstructor
  me {
    name
  }
  users {
    id
    name
    email
  }
}
```

### Type Definitions & Resolvers

Definitions of schema of our graphQL server, and the resolvers are the funtions that are gonna be execute on and specific query.
Primitive Types could be: String, Boolean, Int, Float, ID

``` javascript
//* Type Definitios (Schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!         // Required
    location: String      // Optional
  }
`;

//* Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'Hello, world!';
    },
    name() {
      return 'Facu Rossi';
    },
    location() {
      return 'Cordoba, Argentina';
    },
  },
};

```

### Custom Types

``` javascript
const typeDefs = `
  type Query {
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;
const resolvers = {
  Query: {
    me() {
      return {
        id: '123',
        name: 'Facu',
        email: 'a1gmail.com',
      };
    },
  },
};
```

### Operations

Sending data from the client to the server

``` javascript
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
  }
`;
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      return `Hello ${args.name}, position ${args.position}`;
    },
  },
};

```

### Arrays

``` javascript
const typeDefs = `
  type Query {
    grades: [Int!]!
    users(query: String): [User!]!
  }
`;
const resolvers = {
  Query: {
    grades() {
      return [1, 2, 3];
    },
    users(parent, args, ctx, info) {
      const users = [
        {
          id: '123',
          name: 'Facu',
          email: 'a1gmail.com',
        },
        {
          id: '1233',
          name: 'Juan',
          email: 'Juan@gmail.com',
        },
      ];
      if (!args.query) {
        return users; 
      } else {
        return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
      }
    },
  },
};

```

``` graphql
# Query
query {
  users(query: "f") {
    id
    name
    email
    age
  }
}
# Result
{
  "data": {
    "users": [
      {
        "id": "123",
        "name": "Facu",
        "email": "a1gmail.com",
        "age": null
      }
    ]
  }
}
```

### Relational Data

``` javascript
const users = [
  {
    id: '1',
    name: 'Facu',
    email: 'a1gmail.com',
    age: 24,
  },
  {
    id: '2',
    name: 'Juan',
    email: 'Juan@gmail.com',
  },
  {
    id: '3',
    name: 'Maria',
    email: 'maria@gmail.com',
  },
];

const posts = [
  {
    id: '1',
    title: 'Welcome',
    body: 'hello',
    published: false,
    author: '1',
  },
  {
    id: '2',
    title: 'Hi',
    body: 'how are you?',
    published: false,
    author: '2',
  },
];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;
const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      } else {
        return posts.filter((user) => posts.title.toLowerCase().includes(args.query.toLowerCase()));
      }
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      } else {
        return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
      }
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
  },
};

```

``` graphql
query {
  posts {
    id
    title
    author {
      id
      name
    }
  }
  users {
    id
    name
    posts {
      id
      title
    }
  }
}
```
