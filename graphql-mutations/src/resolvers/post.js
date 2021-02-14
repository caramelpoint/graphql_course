const Post = {
  author(parent, args, { mock }, info) {
    return mock.users.find((user) => {
      return user.id === parent.author;
    });
  },
  comments(parent, args, { mock }, info) {
    return mock.comments.filter((comment) => {
      return comment.post === parent.id;
    });
  },
};

export default Post;
