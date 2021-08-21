export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  rabbitURL: `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}/${process.env.RABBITMQ_USERNAME}`,
  rabbitMediaQueue: process.env.MEDIA_QUEUE,
  queuePattern: process.env.BROKER_QUEUE_PATTERN,
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
