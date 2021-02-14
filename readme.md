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

### Mutations

Most discussions of GraphQL focus on data fetching, but any complete data platform needs a way to modify server-side data as well.

In REST, any request might end up causing some side-effects on the server, but by convention it's suggested that one doesn't use GET requests to modify data. GraphQL is similar - technically any query could be implemented to cause a data write. However, it's useful to establish a convention that any operations that cause writes should be sent explicitly via a mutation.

```javascript
const typeDefs = `
  type Mutation {
    createUser(name: String!, email: String!, age: Int) : User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }
`
const resolvers = {
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.find((user) => user.email === args.email);
      if (emailTaken) {
        throw new Error('Email already in use!');
      }
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };
      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.find((user) => user.id === args.author);
      if (!userExists) {
        throw new Error('Invalid User ID!');
      }
      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.find((user) => user.id === args.author);
      if (!userExists) {
        throw new Error('Invalid User ID!');
      }
      const postExistsAndWasPublished = posts.find((post) => post.id === args.post && post.published);
      if (!postExistsAndWasPublished) {
        throw new Error('Invalid Post!');
      }
      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post,
      };
      comments.push(comment);
      return comment;
    },
  },
}
```

```graphql
mutation {
  createUser(name: "Marce", email: "marce@gmail.com", age: 32) {
    id
    name
    email
    age
  }
  createPost(title: "New Post", body: "sarasa sarasa", published: true, author: "5") {
    id
    title
    body
    published
  }
  createComment(text: "Good Post", author: "1", post: "2") {
    id
    text
  }
}
```

#### Input Type

```javascript
const typeDefs = `
  type Mutation {
    createUser(data: CreateUserInput) : User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }
`
```

```graphql
mutation {
  createUser(data: {
    name: "Marce",
    email: "marcea@gmail.com",
    age: 32
  }) {
    id
    name
    email
    age
  }
}
```

#### Delete

```javascript

// Schema Definition
type Mutation {
  deleteUser(id: ID!): User!
  deletePost(id: ID!): Post!
  deleteComment(id: ID!): Comment!
}

// Resolvers
const Mutation = {
  deleteUser(parent, args, { mock }, info) {
    const userIndex = mock.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = mock.users.splice(userIndex, 1);

    posts = posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        mock.comments = mock.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });
    mock.comments = mock.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
  deletePost(parent, args, { mock }, info) {
    const postIndex = mock.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const deletedPosts = mock.posts.splice(postIndex, 1);

    mock.comments = mock.comments.filter((comment) => comment.post !== args.id);

    return deletedPosts[0];
  },
  deleteComment(parent, args, { mock }, info) {
    const commentIndex = mock.comments.findIndex((comment) => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const deletedComments = mock.comments.splice(commentIndex, 1);

    return deletedComments[0];
  },
};
```

#### Update

```javascript

// Schema Definition
type Mutation {
  updateUser(id: ID!, data: UpdateUserInput!): User!
}

input UpdateUserInput {
  name: String
  email: String
  age: Int
}


// Resolvers
const Mutation = {
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
};
```
