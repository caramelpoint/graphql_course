const Comment = {
  author(parent, args, { mock }, info) {
    return mock.users.find((user) => {
      return user.id === parent.author;
    });
  },
  post(parent, args, { mock }, info) {
    return mock.posts.find((post) => {
      return post.id === parent.post;
    });
  },
};

export default Comment;
