export const config = {
    database: {
        database: process.env.DB_NAME ?? 'todo_list',
        host: process.env.DB_HOST ?? 'localhost',
        password: process.env.DB_PASSWORD ?? 'todo_list_dev',
        port: Number(process.env.DB_PORT ?? 5433),
        user: process.env.DB_USER ?? 'todo_list',
    },
}
