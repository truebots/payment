function getCredentials() {
    return {"web":{"client_id":"703708689581-6hpu15clnu1obilaslvqlg9d6umgtl8g.apps.googleusercontent.com","project_id":"secure-potion-243418","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"Z6zU-qFe7xmgUtxRKuH6UaAn","redirect_uris":["https://us-central1-secure-potion-243418.cloudfunctions.net/function-2","https://us-central1-secure-potion-243418.cloudfunctions.net/function-3"],"javascript_origins":["https://us-central1-secure-potion-243418.cloudfunctions.net"]}}
    //Replace this empty object with credentials.json contents
}


exports.authorized= (req, response)=> {
  response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
  
  
  var f={
 "messages": [
   {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "Your shopping cart was modified.",
          "buttons": [
            {
              "url": "https://us-central1-secure-potion-243418.cloudfunctions.net/function-getShoppingCart?"+
              "muserId="+decodeURIComponent(req.query.muserId)+
              "&googlesheetId="+decodeURIComponent(req.query.googlesheetId)+
              "&refresh_token="+decodeURIComponent(req.query.refresh_token)+"",
              "type":"json_plugin_url",
              "title":"See shopping cart"
            },
            {
              "url": "https://us-central1-secure-potion-243418.cloudfunctions.net/function-getmarket?"+
              "userId="+decodeURIComponent(req.query.muserId)+
              "&googlesheetId="+decodeURIComponent(req.query.googlesheetId)+
              "&refresh_token="+decodeURIComponent(req.query.refresh_token)+"",
              "type":"json_plugin_url",
              "title":"See catalog"
            }
          ]
        }
      }
    }
 ]
};
  
    const {
        client_secret,
        client_id,
        redirect_uris
    } = getCredentials().web
    if (!client_secret || !client_id || !redirect_uris)
        response.send("Credentials missing").status(500)
  
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    var refresh_token = decodeURIComponent(req.query.refresh_token);
    var ur = {
        uri: 'https://www.googleapis.com/oauth2/v4/token?refresh_token=' + refresh_token + '&client_id=703708689581-6hpu15clnu1obilaslvqlg9d6umgtl8g.apps.googleusercontent.com&client_secret=Z6zU-qFe7xmgUtxRKuH6UaAn&grant_type=refresh_token',
        method: 'POST',
        json: true

    };
  
    request(ur, (err, res, token) => {
        if (err) {
            response.send('1' + err);
            return 'pu1' + console.log(err.message);
        }

 
        oAuth2Client.setCredentials(token);
        var access = token["access_token"];
		
      
      
      
      	request('https://sheets.googleapis.com/v4/spreadsheets/'+
                      decodeURIComponent(req.query.googlesheetId)+'/values/'+
                      'Users!A1:G'+'?access_token='+access, { json: true }, (err3, res3, body3) => {
                if (err3) { return console.log(err3); }
                console.log(body3);

                var user=cal(body3.values,decodeURIComponent(req.query.muserId));
        

                console.log(user);

                if(user.length==0){
              

                        var b={
                        "range": "Users!A1:D1",
                        "majorDimension": "ROWS",
                        "values": [
                          [decodeURIComponent(req.query.muserId), 
                           decodeURIComponent(req.query.nameUser),
                          decodeURIComponent(req.query.lastnameUser)],
                        ],
                      };
                         var ur = {

                              uri: 'https://sheets.googleapis.com/v4/spreadsheets/'+
                                    decodeURIComponent(req.query.googlesheetId)+'/values/'+
                                    'Users!A1:D1'+':append?access_token='+access+'&valueInputOption=USER_ENTERED',
                           method: 'POST',
                              json: true,
                            body:b

                          };

                            request( ur, (err6, res6, body6) => {
                        if (err6) { response.send(err6);
                          return console.log(err6); }
                              
                              
              
              
              request('https://sheets.googleapis.com/v4/spreadsheets/'+
                        decodeURIComponent(req.query.googlesheetId)+'/values/'+
                        'Shoppingcart!A1:C'+'?access_token='+access, { json: true }, (err, res, body) => {
                  if (err) { return console.log(err); }
                  console.log(body);

                  var cart=cal(body.values,decodeURIComponent(req.query.muserId));

                  request('https://sheets.googleapis.com/v4/spreadsheets/'+
                              decodeURIComponent(req.query.googlesheetId)+'/values/'+
                              'Products!A1:F'+'?access_token='+access, { json: true }, (err2, res2, body2) => {
                        if (err2) { return console.log(err2); }
                        console.log(body2);
								var userpos=cal(body3.values,decodeURIComponent(req.query.userId))[0];
								var productos=[];
                                  console.log(cart);
                    var search=false;
                    var cant=0;
                    var po=0;
                    
                              for(var j=0;j<cart.length;j++){

                                 var prodpost=cal(body2.values,body.values[cart[j]][1])[0];
                                 
                                 if(body2.values[prodpost][0]==req.query.productId){
                                 search=true;
                                   cant=parseInt(body.values[cart[j]][2]);
                                   po=prodpost;
                                 }
                              }
                                  console.log(productos);
                              if(search==false){
                              
                        var b2={
                        "range": "Shoppingcart!A1:D1",
                        "majorDimension": "ROWS",
                        "values": [
                          [decodeURIComponent(req.query.muserId), 
                           decodeURIComponent(req.query.productId),
                          decodeURIComponent(1)],
                        ],
                      };
                         var ur2 = {

                              uri: 'https://sheets.googleapis.com/v4/spreadsheets/'+
                                    decodeURIComponent(req.query.googlesheetId)+'/values/'+
                                    'Shoppingcart!A1:D1'+':append?access_token='+access+'&valueInputOption=USER_ENTERED',
                           method: 'POST',
                              json: true,
                            body:b2

                          };

                            request( ur2, (err7, res7, body7) => {
                        if (err7) { response.send(err7);
                          return console.log(err7); }
                              
                              response.send(f);
                            
                         });
                                
                              }else{
                                
                                  
                              var b2={
                        "range": "Shoppingcart!C"+po+":D"+po,
                        "majorDimension": "ROWS",
                        "values": [
                          [decodeURIComponent(cant+1)
                        ],
                      };
                         var ur2 = {

                              uri: 'https://sheets.googleapis.com/v4/spreadsheets/'+
                                    decodeURIComponent(req.query.googlesheetId)+'/values/'+
                                    "Shoppingcart!C"+po+":D"+po+'?access_token='+access+'&valueInputOption=USER_ENTERED',
                           method: 'PUT',
                              json: true,
                            body:b2

                          };

                            request( ur2, (err7, res7, body7) => {
                        if (err7) { response.send(err7);
                          return console.log(err7); }
                              
                              response.send(f);
                            
                         });
                              
                              
                              
                              
                                  
                                    
                              }

					 });

              });

                            
                         });
            }
            else
            {


              
              
              
              request('https://sheets.googleapis.com/v4/spreadsheets/'+
                        decodeURIComponent(req.query.googlesheetId)+'/values/'+
                        'Shoppingcart!A1:C'+'?access_token='+access, { json: true }, (err, res, body) => {
                  if (err) { return console.log(err); }
                  console.log(body);

                  var cart=cal(body.values,decodeURIComponent(req.query.muserId));

                  request('https://sheets.googleapis.com/v4/spreadsheets/'+
                              decodeURIComponent(req.query.googlesheetId)+'/values/'+
                              'Products!A1:F'+'?access_token='+access, { json: true }, (err2, res2, body2) => {
                        if (err2) { return console.log(err2); }
                        console.log(body2);
								var userpos=cal(body3.values,decodeURIComponent(req.query.userId))[0];
								var productos=[];
                                  console.log(cart);
                    var search=false;
                    var cant=0;
                    var po=0;
                    
                              for(var j=0;j<cart.length;j++){

                                 var prodpost=cal(body2.values,body.values[cart[j]][1])[0];
                                 
                                 if(body2.values[prodpost][0]==req.query.productId){
                                 search=true;
                                   cant=parseInt(body.values[cart[j]][2]);
                                   po=prodpost;
                                 }
                              }
                                  console.log(productos);
                              if(search==false){
                              
                        var b2={
                        "range": "Shoppingcart!A1:D1",
                        "majorDimension": "ROWS",
                        "values": [
                          [decodeURIComponent(req.query.muserId), 
                           decodeURIComponent(req.query.productId),
                          decodeURIComponent(1)],
                        ],
                      };
                         var ur2 = {

                              uri: 'https://sheets.googleapis.com/v4/spreadsheets/'+
                                    decodeURIComponent(req.query.googlesheetId)+'/values/'+
                                    'Shoppingcart!A1:D1'+':append?access_token='+access+'&valueInputOption=USER_ENTERED',
                           method: 'POST',
                              json: true,
                            body:b2

                          };

                            request( ur2, (err7, res7, body7) => {
                        if (err7) { response.send(err7);
                          return console.log(err7); }
                              
                              response.send(f);
                            
                         });
                                
                              }else{
                                
                                  
                              var b2={
                        "range": "Shoppingcart!C"+po+":D"+po,
                        "majorDimension": "ROWS",
                        "values": [
                          [decodeURIComponent(cant+1)
                        ],
                      };
                         var ur2 = {

                              uri: 'https://sheets.googleapis.com/v4/spreadsheets/'+
                                    decodeURIComponent(req.query.googlesheetId)+'/values/'+
                                    "Shoppingcart!C"+po+":D"+po+'?access_token='+access+'&valueInputOption=USER_ENTERED',
                           method: 'PUT',
                              json: true,
                            body:b2

                          };

                            request( ur2, (err7, res7, body7) => {
                        if (err7) { response.send(err7);
                          return console.log(err7); }
                              
                              response.send(f);
                            
                         });
                              
                              
                              
                              
                                  
                                    
                              }

					 });

              });

             }
      });
      
    });
}

function cal(p1, m)
{
  var t=[];
  
  for(var i=0;i<p1.length;i++){
    
    if(p1[i][0]==m){
      t.push(i);
    }
  }
  
  return t;
  
}
  function caltotal(p1)
{
  var t=0;
  
  for(var i=0;i<p1.length;i++){
    t=t+((p1[i].price)*(p1[i].quantity));
  }
  
  return t;
  
}

exports.helloWorld = (req, res) => {
  let message = req.query.message || req.body.code || 'Hello World!';
  res.status(200).send(message);
};

