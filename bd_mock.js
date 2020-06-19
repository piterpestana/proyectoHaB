/**
 * This file is just a double to use instead of real database.
 * 
 */

let users = [
  
];


let id = 1;

const getUser = (email) => {
    const matchEmail = user => user.email === email;

    return users.find( matchEmail );
}

const saveUser = (email, password, role) => {
    users.push({
        id: id++,
        email,
        password,
        role: role
    })
}


module.exports = {
    getUser,
    saveUser
}