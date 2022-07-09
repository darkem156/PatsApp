const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MySQLDB = require('express-mysql-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

let regExpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

let options = 
{
	host: 'bbrchz1ppsdnirgwxah8-mysql.services.clever-cloud.com',
	user: 'uct50hrdlx5xb3nv',
	password: 'majPlFfJZPfu99yzcSUG',
	database: 'bbrchz1ppsdnirgwxah8',
    charset: 'utf8mb4_unicode_ci'
};

// Sessions
let sessionStore = new MySQLDB(options);

const sessionMW = session(
    {
        key: 'cookie-session',
        secret: 'xdjwmknchewcimkchvjmKFBV1oejucjbhi32ubufo3w1b',
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }
)

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(sessionMW);

let wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// Database Connection
function query(query) 
{
    const con = mysql.createConnection(options);
    let data = new Promise((resolve, reject) => 
    {
        con.query(query,  (err, results )=>
        {
            if(err) return reject(err);
            return resolve(results);
        });
    });
    con.end();
    return data;
}

// Routes
app.get('/', (req, res) =>
{
    console.log(req.session.id_user);
    console.log(req.session.name);
    console.log(req.session.user_name);
    if (req.session.id_user > 0) res.sendFile(__dirname + '/public/index.html');
    else res.sendFile(__dirname + '/public/login.html');
});

app.get('/:url.html', (req, res) =>
{
    res.redirect('/');
});

app.post('/signIn', async (req, res) =>
{
    if (req.body.user === '') res.json({"error": "Debes utilizar un correo electrónico, nombre de usuario, id o teléfono válido para ingresar"});
    else if (req.body.password === '') res.json({"error": "Debes utilizar una contraseña para ingresar"});
    else
    {
        if (req.body.user === "proof")
        {
            if (req.session.id_user > 0) res.json({"session": true, "sessionData": {"id_user": req.session.id_user, "name": req.session.name, "user_name": req.session.user_name}});
            else res.json({"session": false});
        }
        else
        {    
            let id = !isNaN(parseInt(req.body.user)) ? parseInt(req.body.user) : -1
            let private = (await query(`SELECT * FROM private WHERE id = ${id} OR email = '${req.body.user}' OR user_name = '${req.body.user}'`))[0];
            if (!private)
            {
                res.json({"session": false, "error": "Unvalid User or Password"})
                return;
            }
            let hash = await private.password;
            if (await bcrypt.compare(req.body.password, hash))
            {
                let userInfo = await query(`SELECT * FROM users WHERE id = ${parseInt(private.id)}`);
                req.session.name = await userInfo[0].name;
                req.session.user_name = await userInfo[0].user_name;
                req.session.id_user = await userInfo[0].id;
                res.json({"session": true, "error": ''});
            }
            else res.json({"session": false, "error": "Unvalid User or Password"});
        }
    }
})

app.post('/signUp', async (req, res) =>
{
    let emailOk = regExpEmail.test(req.body.email);
    let test = regExpEmail.test(req.body.email);
    if (req.body.user_name === '' || req.body.name === '' || req.body.email === '' || req.body.password === '') res.json({"error": "Debes llenar todos los datos"});
    else if (!emailOk) res.json({"error": "Debes ingresar un correo válido"});
    else if ((await query(`SELECT id FROM users WHERE user_name = '${req.body.user_name}'`))[0]) res.json({"error": "Nombre de usuario en uso"});
    else if ((await query(`SELECT id FROM private WHERE email = '${req.body.email}'`))[0]) res.json({"error": "Este correo ya está registrado"});
    else
    {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        console.log(req.body.password);
        let user_name = req.body.user_name
        await query(`INSERT INTO users(name, user_name, created_at) VALUES('${req.body.name}', '${user_name}', NOW())`);
        let id = await query(`SELECT id FROM users WHERE user_name = '${user_name}'`)
        id = id[0].id
        await query(`INSERT INTO private(id, user_name, password, email) VALUES(${id}, '${user_name}', '${req.body.password}', '${req.body.email}')`)
        res.json({"error": ""});
    }
})

app.get('/user/:user', async (req, res) =>
{
    let users = await query(`SELECT * FROM users WHERE (name LIKE '%${req.params.user}%' OR user_name LIKE '%${req.params.user}%') AND user_name != '${req.session.user_name}'`)
    res.json(users);
})

app.get('/user/', async (req, res) =>
{
    let users = await query(`SELECT * FROM users WHERE user_name != '${req.session.user_name}'`);
    res.json(users);
})

// Static Files
app.use(express.static(__dirname + '/public'))

// Initializing
const server = app.listen(
    app.get('port'), () =>
    {
        console.log('Server on port', app.get('port'));
    }
)

// Socket Io

const SocketIo = require("socket.io");
const io = SocketIo(server);

io.use(wrap(sessionMW));

io.on('connection', async (socket) => 
    {
        if (socket.request.session.id_user)
        {
            console.log(
                {
                    "user": socket.request.session.user_name,
                    "socket": socket.id
                });
            let sockets = await query(`SELECT * FROM sockets WHERE user_name = '${socket.request.session.user_name}'`)
            if (!sockets[0]) await query(`INSERT INTO sockets(user_name, socket) VALUES('${socket.request.session.user_name}', '${socket.id}')`);
            else await query(`UPDATE sockets SET socket = '${socket.id}' WHERE user_name = '${socket.request.session.user_name}'`);
            let pending_messages = await query(`SELECT * FROM pending_messages WHERE receiver = '${socket.request.session.user_name}'`)
            pending_messages.map(async msg =>
                {
                    io.to(socket.id).emit('chat message', msg);
                    await query(`DELETE FROM pending_messages WHERE receiver = '${socket.request.session.user_name}'`);
                })
        }

        socket.on('chat message', async (data) => 
        {
            if (data.msgText === "") return;
            let receiver_name = await query(`SELECT name FROM users WHERE user_name = '${data.receiver}'`);
            receiver_name = await receiver_name[0].name
            let msgData = 
            {
                "sender": socket.request.session.user_name,
                "sender_name": socket.request.session.name,
                "msgText": data.msgText,
                "msgDate": data.msgDate,
                "receiver": data.receiver,
                "receiver_name": receiver_name
            }
            let receiverSocket = (await query(`SELECT socket FROM sockets WHERE user_name = '${data.receiver}'`))[0]
            if (await receiverSocket)
            {
                io.to(await receiverSocket.socket).emit('chat message', msgData);
            }
            else
            {
                await query(`
                    INSERT INTO pending_messages(sender, sender_name, msgText, msgDate, receiver, receiver_name) VALUES('${socket.request.session.user_name}', '${socket.request.session.name}', '${data.msgText}', '${data.msgDate}', '${data.receiver}', '${receiver_name}');
                `)
            }
            io.to(socket.id).emit('chat message', msgData);
        });
        socket.on('disconnecting', async (reason) =>
        {
            await query(`DELETE FROM sockets WHERE user_name = '${socket.request.session.user_name}'`);
        })
    }
);