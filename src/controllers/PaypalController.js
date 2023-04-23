const request = require('request');

function verify(req, res){
  res.status(200).send('OK');
  res.end();

  console.log('Verifying');
  console.log(JSON.stringify(req.body));

  // const body = 'cmd=_notify-validate&' + JSON.stringify(req.body);
  let postreq = 'cmd=_notify-validate';
      
  // Iterate the original request payload object
  // and prepend its keys and values to the post string
  Object.keys(req.body).map((key) => {
    postreq = `${postreq}&${key}=${body[key]}`;
    return key;
  });


  const options = {
    url: 'https://www.sandbox.paypal.com/cgi-bin/webscr', //https://ipnpb.paypal.com/cgi-bin/webscr,
    method: 'POST',
    headers: {
        'Connection': 'close'
    },
    body: postreq,
    strictSSL: true,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  };

  //POST IPN data back to PayPal to validate

  //sandbox para depuracion
  request(options, function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        //Inspect IPN validation result and act accordingly
      if (body.substring(0, 8) === 'VERIFIED') {

        //The IPN is verified
        console.log('Verified IPN!');
      } else if (body.substring(0, 7) === 'INVALID') {
        //The IPN invalid
        console.log('Invalid IPN!');
        res.status(400).send({status: false})
      } else {
        //Unexpected response body
        console.log('Unexpected response body!');
        console.log(body);
        res.status(400).send({status: false})
      }
    }else{
      //Unexpected response
      console.log('Unexpected response!');
      console.log(response);
      res.status(400).send({status: false})
    
    }

  });


  // fetch('https://www.sandbox.paypal.com/cgi-bin/webscr', options)
  //   .then(res => {
  //     if (res.substring(0, 8) === 'VERIFIED') {
  //       // req.getConnection((err, conn) => {
  //       //   conn.query('INSERT INTO users SET ?', data, (error, results, fields) => {

  //       //   })
  //       // })
  //       //The IPN is verified
  //       console.log('Verified IPN!');
  //     } else if (res.substring(0, 7) === 'INVALID') {

  //         //The IPN invalid
  //       console.log('Invalid IPN!');
  //     } else {
  //       //Unexpected response res
  //       console.log('Unexpected response res!');
  //       console.log(res);
  //     }
  //   })
  //   .catch(err => {
  //     console.log('Unexpected response!');
  //     console.log(err);
  //   })

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