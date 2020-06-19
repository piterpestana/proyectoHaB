var validator = require('validator');
const nodeMailer = require('nodemailer');
const emailPass = process.env.emailPass;

let suppliers = [];

// mover suppliers con bdmock a bdmock y guardarlos, 

const list = (req, res) => {

    let filteredSuppliers = suppliers;

    const name = req.query['name'];
    const place = req.query['place'];
    const price = req.query['price'];
    const services = req.query['services'];
    const score = req.query['score'];


    // No consigo que funcione el cálculo de la media de score
    if (name !== undefined) {
        filteredSuppliers = suppliers
            .filter(supplier => name.indexOf(supplier.name) !== -1)
            .map(function (field) {
                field = {}
                field.name = field.name
                field.place = field.place
                field.price = field.price
                field.services = field.services


                // aquí hacer una media del array


                Array.prototype.sum = function (prop) {
                    var total = 0
                    for (var i = 0, _len = this.length; i < _len; i++) {
                        total += this[i][prop]
                    }
                    return total
                }

                field.score = filteredSuppliers.sum("score") / filteredSuppliers.length

            })
    }

    if (place !== undefined) {
        filteredSuppliers = suppliers.filter(supplier => place.indexOf(supplier.place) !== -1)
    }
    // filtered products debe ordenar de menor a mayor
    if (price !== undefined) {

        filteredSuppliers.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));

        //filteredSuppliers = suppliers.sort(suppliers.price)
    }
    if (services !== undefined) {
        filteredSuppliers = suppliers.filter(supplier => services.indexOf(supplier.services) !== -1)
    }
    // filtered products debe ordenar de mayor a menor
    if (score !== undefined) {
        filteredSuppliers.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
    }

    res.json(filteredSuppliers);

}

id = 1

const add = (req, res) => {

    suppliers.push({
        id: id++,
        name: req.body.name,
        place: req.body.place,
        services: req.body.services,
        price: parseInt(req.body.price),
        score: parseInt(req.body.score)
    })

    res.send();
}

const addScore = (req, res) => {

    // si params = id: push score
    req.params.id = id

    suppliers.push({
        score: parseInt(req.body.score)
    })

    res.send();
}


var emailRequest = (req, res) => {
    try {

        const email = req.body['email'];
        const name = req.body['name'];
        const number = req.body['number'];
        const request = req.body['request']


        if (validator.isEmail(email) === false) {

            return res.status(400).send({
                "error": {
                    "message": "Please provide a valid email"
                }
            });
        }

        if (validator.isNumeric(number) === false) {

            return res.status(400).send({
                "error": {
                    "message": "Please provide a valid number"
                }
            });
        }

        if (!email || !number || !name) {
            return res.status(400).send({
                "error": {
                    "message": "Some fields are missing"
                }
            });
        }

        let transporter = nodeMailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: {
                user: 'pps@marosavat.com',
                pass: emailPass
            }
        });
        let mailOptions = {
            from: '"Pedro Pestana" <pps@marosavat.com>',
            to: 'pps@marosavat.com',
            subject: 'Booking request',
            html: `<b><h1>Prueba de email</h1> </b> || <b> Nombre: ${name} </b> || <b> Number: ${number} </b> || <b> Email: ${email} </b> || Solicitud: ${request} ||`

        };

        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                throw new error('Something went wrong')
            }
            console.log(data);
            return res.status(200).send({
                "status": true,
                "message": "Email Sent Successfully."
            });
        });

    } catch (err) {
        console.log(err);
        return res.status(200).send({
            "error": {
                "message": "Something went wrong"
            }
        });
    }
}

var emailResponse = (req, res) => {
    try {

        const email = req.body['email'];

        if (!email) {
            return res.status(400).send({
                "error": {
                    "message": " Email required"
                }
            });
        }

        let transporter = nodeMailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: {
                user: 'pps@marosavat.com',
                pass: emailPass,
            }
        });
        let mailOptions = {
            from: '"Pedro Pestana" <pps@marosavat.com>',
            to: email,
            subject: 'Booking confirmation',
            html: `<b><h1>Tu solicitud ha sido confirmada</h1> `

        };

        transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                throw new error('Something went wrong')
            }
            console.log(data);
            return res.status(200).send({
                "status": true,
                "message": "Email Send Successfully."
            });
        });

    } catch (err) {
        console.log(err);
        return res.status(200).send({
            "error": {
                "message": "Something went wrong"
            }
        });
    }
}






module.exports = {
    add,
    list,
    emailRequest,
    emailResponse
}