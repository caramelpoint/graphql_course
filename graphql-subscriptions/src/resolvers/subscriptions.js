const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      const channelName = 'count';
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish(
          channelName,
          {
            count,
          },
          3000
        );
      });
      // Channel Name
      return pubsub.asyncIterator(channelName);
    },
  },

  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const channelName = `comment ${postId}`;
      const post = db.posts.find((post) => post.id === postId && post.published);
      if (!post) {
        throw new Error('Post Not found!');
      }
      return pubsub.asyncIterator(channelName);
    },
  },

  post: {
    subscribe(parent, args, { pubsub }, info) {
      const channelName = 'post';
      return pubsub.asyncIterator(channelName);
    },
  },
};

export default Subscription;
