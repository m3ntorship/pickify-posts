export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  firebaseServiceFile:
    process.env.FIREBASEPATH || '/firebase_service_account.json',
  rabbitURL: `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}/${process.env.RABBITMQ_VHOST}`,
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
