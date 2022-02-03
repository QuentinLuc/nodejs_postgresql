import { Client } from "pg";
import * as readline from "readline";
import { stdin as input, stdout as output } from 'process';

const users = ['qlu_back', 'qlu_back_1', 'qlu_back_2', 'qlu_back_3'];
const queries = [
    'select * from farm order by id desc',
    'select * from farm_season_results where created_at > \'2021-06-30\' limit 10',
    'select * from "user" where first_name ilike \'%e%\'',
    'select * from farm_season order by id'
];

const getConnection = async (idx: number, useConnectionPool: boolean) => {
    const clientIdx = Math.floor(Math.random() * 4);

    const client = new Client({
        host: '',
        user: users[clientIdx],
        password: '',
        database: '',
        port: useConnectionPool ? 6432 : 5432,
        ssl: true,
    });

    await client.connect();

    console.log("");
    console.log(`User selected: ${client.user}`);
    
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    console.log(`Client ${idx} connected at ${today.toISOString()}`);

    const queryIdx = Math.floor(Math.random() * 4);
    const query = queries[queryIdx];
    console.log(`Query selected: ${query}`)

    const result = await client.query(query);
    const timeElapsed2 = Date.now();
    const today2 = new Date(timeElapsed2);
    console.log(`Count ${result.rowCount} at ${today2.toISOString()}`);
    
    // await client.end()
}

const main = async (useConnectionPool: boolean) => {
    console.log("Starting...");
    console.log("");

    for(let i: number = 0; i < 150; i++){
        getConnection(i, useConnectionPool);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const rl = readline.createInterface({ input, output });
    rl.question("Press ENTER to exit ", () => {
        console.log("Stopping...\n");
        process.exit();
    });
}

main(true);
