const request = require('request');

function saveNewDate(req, body, deleteCutDate = false){
  req.getConnection((err, conn) => {
    const actualDate = new Date();
    actualDate.setMonth(actualDate.getMonth() + 3)
    data = {
      cut_date: deleteCutDate ? null : actualDate
    }
    console.log('data to update :>> ', data);
    conn.query('UPDATE users SET ? WHERE payer_id = ? ', [data, body.payer_id], (error, results, fields) => {
      if(error){
        console.log(error);
      }
    })
  })
}

function verify(req, res){
  res.status(200).send('OK');
  res.end();

  const body = req.body;
  console.log('body :>> ', JSON.stringify(body));
  let postreq = 'cmd=_notify-validate';
      
  // Iterate the original request payload object
  // and prepend its keys and values to the post string
  Object.keys(body).map((key) => {
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
        let deleteCutDate = false;
        if(req.body.txn_type === 'recurring_payment_profile_cancel') deleteCutDate = true;
        saveNewDate(req, body, deleteCutDate);
        console.log('Verified IPN!');
      } else if (body.substring(0, 7) === 'INVALID') {
        //The IPN invalid
        console.log('Invalid IPN!');
      } else {
        //Unexpected response body
        console.log('Unexpected response body!');
        console.log(body);
      }

    }else{
      //Unexpected response
      console.log('Unexpected response!');
      console.log(response);
      res.status(400).send({status: false})
    
    }

  });
}

function firstPayment(req, res){
  req.getConnection((err, conn) => {
    const body = {
      payer_id: req.body.payer_id,
    }
    conn.query('UPDATE users SET ? WHERE email = ?', [body, req.user.email], (error, results, fields) => {
      if(err){
        res.status(400).send({ status: false, err});
        return false
      }
      res.status(200).send({ status: true, msg: 'Created payer id'});
      saveNewDate(req, body, false);
      return true
    })
  })
}



module.exports = {
  verify,
  firstPayment
}