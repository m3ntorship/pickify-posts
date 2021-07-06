export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  rabbitURL: process.env.RABBITMQ_URL,
  rabbitMediaQueue: process.env.MEDIA_QUEUE,
  clients: {
    posts: {
      baseURL: process.env.POSTS_SERVICE_URL,
    },
    notifications: {
      baseURL: process.env.NOTIFICATIONS_SERVICE_URL,
    },
    upload: {
      baseURL: process.env.UPLOAD_SERVICE_URL,
    },
    media: {
      baseURL: process.env.MEDIA_SERVICE_URL,
    },
  },
});
