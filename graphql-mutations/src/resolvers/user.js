const User = {
  posts(parent, args, { mock }, info) {
    return mock.posts.filter((post) => {
      return post.author === parent.id;
    });
  },
  comments(parent, args, { mock }, info) {
    return mock.comments.filter((comment) => {
      return comment.author === parent.id;
    });
  },
};

export default User;
