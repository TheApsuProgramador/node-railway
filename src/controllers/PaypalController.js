
function verify(req, res){
  // console.log('Sillega :>> ', 'Sillega');
  // res.status(200).send({status: true});
  // return 
  //Read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
  console.log('Verifying');
  console.log(JSON.stringify(req.body));
  const body = 'cmd=_notify-validate&' + req.body;


  const options = {
    method: 'POST',
    headers: {
        'Connection': 'close'
    },
    body: body,
    strictSSL: true,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  };

  //POST IPN data back to PayPal to validate

  //sandbox para depuracion

  fetch('https://www.sandbox.paypal.com/cgi-bin/webscr', options)
    .then(res => {
      if (res.substring(0, 8) === 'VERIFIED') {
        // req.getConnection((err, conn) => {
        //   conn.query('INSERT INTO users SET ?', data, (error, results, fields) => {

        //   })
        // })
        //The IPN is verified
        console.log('Verified IPN!');
      } else if (res.substring(0, 7) === 'INVALID') {

          //The IPN invalid
        console.log('Invalid IPN!');
      } else {
        //Unexpected response res
        console.log('Unexpected response res!');
        console.log(res);
      }
    })
    .catch(err => {
      console.log('Unexpected response!');
      console.log(err);
    })

  // request(options, function callback(error, response, body) {
  //   if (!error && response.statusCode === 200) {
  //     //Inspect IPN validation result and act accordingly
  //     if (body.substring(0, 8) === 'VERIFIED') {

  //         //The IPN is verified
  //         console.log('Verified IPN!');
  //     } else if (body.substring(0, 7) === 'INVALID') {

  //         //The IPN invalid
  //         console.log('Invalid IPN!');
  //     } else {
  //         //Unexpected response body
  //         console.log('Unexpected response body!');
  //         console.log(body);
  //     }
  //   }else{
  //     //Unexpected response
  //     console.log('Unexpected response!');
  //     console.log(response);
  //   }

  // });
}

module.exports = {
  verify,
}