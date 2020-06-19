/**
Portal de búsqueda de proveedores B2B, con información histórica de los usuarios (clientes), para que
 otros clientes encuentren al proveedor perfecto, basado en score de interacciones anteriores.
 ANÓNIMO :

●Visualizar la landing 
●Búsqueda por: 
	○Localidad 
	○Precio 
	○Operaciones de compraventa 
	○Score. 

●Login 
●Registro (le llega email de registro) USUARIOS REGISTRADOS: (la misma persona puede ser cliente y proveedor) 
●Gestión del perfil (cambios...) 
●Búsqueda por: 
	○Localidad 
	○Precio 
	○Operaciones de compraventa 
	○Score 

●Solicitud de reserva (le llega email de confirmación) 
●Publicar un producto/servicio ofrecido. 
●Aceptar reserva de producto/servicio ofrecido. 
●Valorar al proveedor
 * 
 */

require('dotenv').config();

//AÑADIDO PARA LOGS:(4 lineas)

var logger = require('morgan');
var createError = require('http-errors');
var path = require('path');


const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const server = express(); // necesito esto?


const { register, login, updateUser } = require('./routes/users');
const { isAuthenticated } = require('./routes/auth')
const { add, list, addScore, emailRequest, emailResponse } = require('./routes/events');

const port = process.env.PORT;
const apiKey = process.env.token

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const miMiddleware = (req, res, next) => {
    console.log('código que se ejecuta antes de procesar el endpoint');
    next();
}
const miMiddlewareWrapper = (req, res, next) => {
    return miMiddleware;
}
app.use(miMiddleware);
app.use(miMiddlewareWrapper());

// add middleware to parse the json
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));

// LOS SIGUIENTES MIDDLEWARE NO SÉ SI ESTÁN BIEN O SOBRAN (los cogí de una libreria)
// catch 404 error
server.use(function (req, res, next) {
    const err = new Error('Requested URL Not Found !');
    err.status = 404;
    next(err);
});

//Error handler
server.use(function (err, req, res, next) {
    res.locals.message = err.message;

    // render the error page
    res.status(err.status || 500);
    res.send({
        "error": {
            "message": res.locals.message
        }
    });
});


// APIs necesarias en la aplicación

// register
app.post('/user', register);

// login
app.post('/user/login', login);

// gestion del perfil : tengo problemas con la función updateUser
app.put('/user', isAuthenticated, updateUser);

// post proveedores:
app.post('/suppliers', isAuthenticated, add);

// post score:
//app.post('/suppliers/:id/score', isAuthenticated, addScore);

// get proveedores (sin autorizacion y con la opción de filtrar - tengo problemas con filtrar por nombre+media en score-)
app.get('/suppliers', list);

// solicitar reserva y enviar email
app.post('/send-email', isAuthenticated, emailRequest)

// enviar email de confirmación de reserva
app.post('/response-email', isAuthenticated, emailResponse)

// enviar factura PT (no consigo convertirlo en una función que saque a events)

//la API key no consigo cogerla de .env .Si la meto directamente, funciona. 
/*
const moment = require('moment')
var http = require("https");
const axios = require('axios');

(async()=>{ 
invoice = {
    "invoice": {
        "date": moment(),
        "due_date": moment().add(15, 'Days'),
        "reference": "",
        "observations": "Observations",
        "retention": "0",
        "tax_exemption": "M01",
        "sequence_id": "2/2020",
        "manual_sequence_number": "1",
        "client": {
            "name": "clientePrueba",
            "code": "A1",
            "email": "foo@bar.com",
            "address": "Saldanha",
            "city": "Lisbon",
            "postal_code": "1050-555",
            "country": "Portugal",
            "fiscal_id": "508000000",
            "website": "www.website.com",
            "phone": "910000000",
            "fax": "210000000",
            "observations": "Observations"
        },
        "items": [
            {
                "name": "Item Name",
                "description": "Item Description",
                "unit_price": "100",
                "quantity": "5",
                "unit": "service",
                "discount": "50",
                "tax": {
                    "name": "IVA23"
                }
            }
        ],
        "mb_reference": "0",
        "tax_exemption_reason": "M00",
        "currency_code": "USD",
        "rate": "1.23565"
    }

}


   const response = await axios.post(`marosavatslu.app.invoicexpress.com/invoices.json?api_key=${process.env.apiKey}`, invoice)

 })()


*/



var options = {
    "method": "POST",
    "hostname": "marosavatslu.app.invoicexpress.com",
    "port": null,
    "path": `/invoices.json?api_key=${process.env.apiKey}`,
    "headers": {
        "accept": "application/json",
        "content-type": "application/json"
    }
}

var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

invoiceNr = 1

req.write(JSON.stringify({
    "invoice": {
        "date": moment(),
        "due_date": moment().add(15, 'Days'),
        "reference": "",
        "observations": "Observations",
        "retention": "0",
        "tax_exemption": "M01",
        "sequence_id": "2/2020",
        "manual_sequence_number": invoiceNr++,
        "client": {
            "name": "clientePrueba",
            "code": "A1",
            "email": "foo@bar.com",
            "address": "Saldanha",
            "city": "Lisbon",
            "postal_code": "1050-555",
            "country": "Portugal",
            "fiscal_id": "508000000",
            "website": "www.website.com",
            "phone": "910000000",
            "fax": "210000000",
            "observations": "Observations"
        },
        "items": [
            {
                "name": "Item Name",
                "description": "Item Description",
                "unit_price": "100",
                "quantity": "5",
                "unit": "service",
                "discount": "50",
                "tax": {
                    "name": "IVA23"
                }
            }
        ],
        "mb_reference": "0",
        "tax_exemption_reason": "M00",
        "currency_code": "USD",
        "rate": "1.23565"
    }

}))

req.end();

// create Account in InvoiceXpress I tried Axios
/*
const axios = require('axios');
const url = 'https://www.app.invoicexpress.com/api/accounts/create.xml'
const email = 'pedro@hboss.com'
const password = '1234';



const registerSupplier = async (email, password) => {
    const response = await axios.post('https://www.app.invoicexpress.com/api/accounts/create.xml', {
        headers: { Content- Type: application/ xml; charset = utf - 8
},
    xml.stringify(<account>
        <organization_name>Company name</organization_name>
        <email>email</email>
        <password>password</password>
        <terms>1</terms>
    </account>)
    );

return response
}
*/


// enviar factura Hungría


// enviar factura Italia




/*

app.use((error, req, res, next) => {

    res
        .status(error.status || 500)
        .send({ status: 'error', message: error.message })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

*/