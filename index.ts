import index from "./src/views/index.html";
import leaderboard from "./src/views/leaderboard.html";
import { Database } from "bun:sqlite";
const db = new Database("rank.sqlite", { create: true });

db.run(`
  CREATE TABLE IF NOT EXISTS rank (
    username TEXT PRIMARY KEY,
    streak INTEGER NOT NULL
  );
`);

interface Rank {
	username: string;
	streak: number;
}

async function saveStreak(rank: Rank) {
	// We use an UPSERT (INSERT ... ON CONFLICT) so if the username already exists, 
	// it will update their streak instead of crashing due to the PRIMARY KEY constraint.
	const query = db.prepare(`
        INSERT INTO rank (username, streak) 
        VALUES ($username, $streak)
        ON CONFLICT(username) DO UPDATE SET streak = $streak;
    `);

	// Execute the query securely using bound parameters to prevent SQL injection
	query.run({
		$username: rank.username,
		$streak: rank.streak
	});
}

async function getAllStreaks(): Promise<Rank[]> {
	const query = db.prepare(`
        SELECT username, streak 
        FROM rank 
        ORDER BY streak DESC;
    `);

	// .all() returns an array of objects matching our schema
	return query.all() as Rank[];
}


Bun.serve({
	routes: {
		"/": index,
		"/table": leaderboard,
		"/rank": {
			GET: async req => {
				let r = await getAllStreaks()
				return Response.json({ list: r });
			},

			POST: async req => {
				const body = await req.json() as Rank;
				await saveStreak(body)
				return Response.json({ created: true });
			},
		},
	},
	port: 3001,
});

console.log('app runninnng ok my boy');
