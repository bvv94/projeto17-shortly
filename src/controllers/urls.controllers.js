import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js";
import { v4 as uuidv4 } from "uuid";
export async function shorten(req, res) {
    const { url } = req.body;
    const { user_id } = res.locals.session;

    const shortUrl = nanoid(8);
    console.log(shortUrl);
    // const shortUrl = uuidv4();
    try {
        const save = await db.query(`INSERT INTO urls (user_id, short_url, url)
                        VALUES ($1, $2, $3) RETURNING (id, short_url);`, [user_id, shortUrl, url]);

        console.log(save)
        const result = save.rows[0].short_url;
        res.status(201).send(result)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}