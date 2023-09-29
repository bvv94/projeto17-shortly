import { db } from "../database/database.connection.js";

export default async function me(req, res) {
    const { user_id } = res.locals.session;

    try {
        const totalVisits = await db.query(`
            SELECT SUM(visit_count) AS "visitCount"
                FROM urls WHERE user_id = $1;`, [user_id]);

        const { name } = await db.query(`SELECT name FROM users WHERE id = $1;`, [user_id]);

        const shortenedUrls = await db.query(`
            SELECT id, short_url AS "shortUrl", url, visit_count AS "visitCount"
                FROM urls WHERE user_id = $1;`, [user_id]);

        res.status(200).send(formatted);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}