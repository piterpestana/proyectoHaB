require('dotenv').config();
const moment = require('moment')
var http = require("https");
const axios = require('axios');


(async () => {
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

