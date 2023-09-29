import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js";
import joi from "joi";

export async function shorten(req, res) {
    const { url } = req.body;
    const { user_id } = res.locals.session;

    //----Validação de URL válida-----//
    const schema = joi.object({
        url: joi.string().uri().required()
    });
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }
    //----Fim da validação de URL válida-----//

    const shortUrl = nanoid(8);

    try {
        const save = await db.query(`INSERT INTO urls (user_id, short_url, url)
                        VALUES ($1, $2, $3) RETURNING id, short_url;`, [user_id, shortUrl, url]);
        const info = save.rows[0];

        const result = { id: info.id, shortUrl: info.short_url }

        res.status(201).send(result)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getUrls(req, res) {

    const { id } = req.params;

    const exists = await db.query(`SELECT * FROM urls WHERE id=$1;`, [id])
    if (exists.rows.length === 0) return res.status(404).send("URL não encontrada");

    try {
        const result = await db.query(`SELECT id, short_url, url FROM urls WHERE id=$1;`, [id]);

        const { id: urlId, short_url, url } = result.rows[0];

        const formatted = { id: urlId, shortUrl:short_url, url }

        res.status(200).send(formatted)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export async function openShortURL(req, res) {
    const { shortUrl } = req.params;
    
    try {
        const result = await db.query(`SELECT * FROM urls WHERE short_url = $1;`, [shortUrl]);
        if (result.rows.length === 0) return res.status(404).send("URL não encontrada");

        let count = result.rows[0].visit_count + 1;
        await db.query(`UPDATE urls SET visit_count = $1 WHERE short_url = $2;`, [count, shortUrl]);
        res.redirect(result.rows[0].url);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}