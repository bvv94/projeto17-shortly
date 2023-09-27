import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js";

export async function sign_up(req, res){
    const {name, email, password, confirmPassword} = req.body;

    if (password !== confirmPassword) return res.status(401).send("Senhas não são iguais!!!")
    // talvez aqui o status deva ser 422
    try{
        const exists = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);

        if(exists && (exists.rowCount !== 0)){
            return res.status(409).send("email já cadastrado!")
        }
        const hash = bcrypt.hashSync(password, 10);

        db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hash]);

        return res.sendStatus(201);
    }
    catch (err){
        res.status(500).send(err.message);
    }
}

export async function sign_in(req, res){
    const {email, password} = req.body;

    try{
        const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
        if (user.rows.length == 0) return res.status(404).send("Email não cadastrado");

        const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].password);
        if (!isPasswordCorrect) return res.status(401).send("Usuário/senha inválidos");

        const token = uuid()

        res.status(200).send(token);
    }
    catch (err){
        res.status(500).send(err.message);
    }
}

export async function sign_out(req, res){
    
    const {id} = res.locals.session;

    try{    
        await db.query(`UPDATE sessions SET active = false WHERE id = $1;`, [id]);
        return res.sendStatus(200);
    }
    catch (err){ 
        res.status(500).send(err.message);
    }
}