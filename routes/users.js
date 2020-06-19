const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// just for academic purpose until database module is ready
const bd = require('../bd_mock');


const register = async (req, res) => {
    // coger datos del body (email, password)
    const { email, password } = req.body;

    // comprobaremos que son válidos
    if (!email || !password) {
        res.status(400).send('Some fields are missing');
        return;
    }

    // comprobar si ya existe un existe un usuario con este email
    if (bd.getUser(email)) {
        res.status(409).send('The user already exists');
        return;
    }

    // encriptar la password (para no almacenarla en texto claro)
    // bcrypt.hash(<password en claro (ej.: 1234)>, <número de "rounds">)
    //    rounds = 3
    //         hash(hash(hash(password)))
    const passwordBcrypt = await bcrypt.hash(password, 10);

    // almacenamos (email, passwordBcrypt)
    bd.saveUser(email, passwordBcrypt, 'normal');

    res.send();
}


const login = async (req, res) => {
    const { email, password } = req.body;

    // buscar email en la bbdd
    // nos devolverá un JSON para el usuario con un ID, un role, y su password
    const user = bd.getUser(email);



    if (!user) {
        res.status(404).send();
        return;
    }

    // comprobar la password (ojo! con bcrypt)
    // error si no matchean
    const passwordIsvalid = await bcrypt.compare(password, user.password);

    if (!passwordIsvalid) {
        res.status(401).send();
        return;
    }

    const tokenPayload = {
        id: user.id,
        role: user.role,
        email: user.email
    };

    const token = jwt.sign(tokenPayload, process.env.SECRET, {
        expiresIn: '1d'
    });

    res.json({
        token
    })
}

const updateUser = (req, res) => {


    let searchedElement = users.find(user => user.id === req.body.id);
    if (searchedElement === undefined) {
        res.status(404).send('Este usuario no está registrado');
        return;
    }

    searchedElement.id = req.body.id;
    searchedElement.email = req.body.email;
    searchedElement.phone = req.body.phone;

    res.send()
}

module.exports = {
    login, register, updateUser
}
