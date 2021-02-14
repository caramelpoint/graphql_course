import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser(parent, args, { mock }, info) {
    const emailTaken = mock.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email taken');
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    mock.users.push(user);

    return user;
  },
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
  createPost(parent, args, { mock }, info) {
    const userExists = mock.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    mock.posts.push(post);

    return post;
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
  createComment(parent, args, { mock }, info) {
    const userExists = mock.users.some((user) => user.id === args.data.author);
    const postExists = mock.posts.some((post) => post.id === args.data.post && post.published);

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post');
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    mock.comments.push(comment);

    return comment;
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

export default Mutation;
