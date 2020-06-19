

// API KEY FATTURA24: t9WeQ1XEcylvpDa8iVC2GxDVl1z39vuF

var fattura24 = new Fattura24({ apiKey: 't9WeQ1XEcylvpDa8iVC2GxDVl1z39vuF' });
 


// CREATE NEW CLIENT

fattura24.saveCustomer({
    CustomerName: 'MARIO ROSSI',
    CustomerAddress: 'Via Alberti 8',
    CustomerPostcode: '06122',
    CustomerCity: 'Perugia',
    CustomerProvince: 'PG',
    CustomerCountry: '',
    CustomerFiscalCode: 'MARROS66C44G217W',
    CustomerVatCode: '03912377542',
    CustomerCellPhone: '335123456789',
    CustomerEmail: 'pps@marosavat.com'
}).then(function( customer ) {
    console.log( customer );
}).catch(function( error ) {
    console.error( error );
});

// CREATE NEW INVOICE

fattura24.saveDocument({
  TotalWithoutTax: 29.10,
  VatAmount: 0,
  DocumentType: 'FE',
  SendEmail: false,
  FeVatNature: 'N4',
  Object: 'Handmade products export',
  Total: 29.10,
  Payments: {
    Payment: {
      Date: '2018-12-14',
      Paid: true,
      Amount: 29.10
    }
  },
  CustomerName: 'John Doe',
  CustomerAddress: '29, 5th Avenue',
  CustomerPostcode: 'AA12345',
  CustomerCity: 'NYC',
  CustomerCountry: 'USA',
  CustomerCellPhone: '+15551234567',
  CustomerEmail: 'pps@marosavat.com',
  FootNotes: 'Grazie per aver acquistato da noi',
  Rows: [
    {
      Row: {
        Code: '001',
        Description: 'Wooden Chair',
        Price: 29.10,
        VatCode: 0,
        VatDescription: '0%',
        Qty: 1
      },
    },
  ],
})
.then(console.log)
.catch(console.log);



