import { db } from "../database/database.connection.js"

export default async function ranking(req, res) {
    try {
        const rank = await db.query(`
        SELECT 
        users.id, 
        users.name, 
        COUNT(urls.id) as "linksCount",
        CASE WHEN urls.visit_count IS NULL THEN 0 ELSE urls.visit_count END as "visitCount"
    FROM 
        users
    LEFT JOIN 
        urls ON users.id = urls.user_id
    GROUP BY 
        users.id, users.name, urls.visit_count
    ORDER BY 
        SUM(CASE WHEN urls.visit_count IS NULL THEN 0 ELSE urls.visit_count END) DESC
    LIMIT 
        10
        `);

        const formatted = rank.rows.map(row => ({
            id: row.id,
            name: row.name,
            linksCount: row.linksCount,
            visitCount: row.visitCount
        }))
        res.status(200).send(formatted);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}