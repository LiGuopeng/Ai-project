export default () => ({
  database: {
    host: '127.0.0.1', // 子网IP，公网IP
    port: 5432,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    baseUrl: process.env.BASE_URL,
  },
});
