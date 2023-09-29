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

    const { id } = req.params

    const exists = await db.query(`SELECT * FROM urls WHERE id=$1;`, [id])
    if (!exists.rows.length) return res.status(404).send("URL não encontrada");

    try {
        const urls = await db.query(`SELECT (id, short_url, url) FROM urls WHERE id=$1;`, [id]);
        console.log(urls);

        const { id, short_url, url } = urls.rows[0];

        const formatted = { id, short_url, url }

        res.status(200).send(formatted)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export async function openShortUrl(req, res) {
    const { shortUrl } = req.params;

    // - Redirecionar o usuário para o link correspondente.
    // - Aumentar um na contagem de visitas do link.
    // - Caso a url encurtada não exista, responder com *status code* `404`.

    const file = db.query(`SELECT * FROM urls WHERE short_url = $1;`, [shortUrl]);
    if (!file.rows.length) return res.status(404).send("URL não encontrada");

    let count = file.rows[0].visit_count + 1;

    try {
        await db.query(`UPDATE urls SET visit_count = $1 WHERE short_url = $2;`, [count, shortUrl]);
        res.redirect(file.rows[0].url);

        // res.writeHead(301, { Location: file.rows[0].url });
        // res.end();
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}