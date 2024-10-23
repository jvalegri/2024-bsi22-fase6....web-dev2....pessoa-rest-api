import { connect } from '../database'
import { RequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

const getManyUsers: RequestHandler = async (req, res) => {
  const db = await connect()
  const users = await db.all('SELECT id, name, email FROM users')
  res.json(users)
}

const createUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { name, email } = req.body
  const result = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID])
  res.json(user)
}

const updateUser: RequestHandler = async (req, res) => {
    const db = await connect();
    const { name, email, password } = req.body;
    const { id } = req.params;

    if (!req.headers.authorization)
        return res.status(401).json({ message: 'No token provided' })
    
    const token = req.headers.authorization
    const decoded = jwt.decode(token) as JwtPayload;

    if (id != decoded.id) {
        return res.status(403).json({ message: 'Você não pode editar dados de outros usuários.' });
    }

    await db.run('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    res.json(user);
};


const deleteUser: RequestHandler = async (req, res) => {
    const db = await connect();
    const { id } = req.params;

    if (!req.headers.authorization)
        return res.status(401).json({ message: 'No token provided' })
    
    const token = req.headers.authorization
    const decoded = jwt.decode(token) as JwtPayload;

    if (id != decoded.id) {
        return res.status(403).json({ message: 'Você não pode excluir dados de outros usuários.' });
    }

    await db.run('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuário excluído' });
};

export default { 
  getManyUsers, 
  createUser, 
  updateUser, 
  deleteUser 
}