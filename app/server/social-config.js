//facebook
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '428054760735795',
    secret: '94273e8f4c4a051bf53f2ecc20210e5b'
});

//twitter
ServiceConfiguration.configurations.remove({
    service: 'twitter'
});

ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: 'PIuIL250RfE3AXHQOHjp5AHsJ',
    secret: 'DvmUy54QSBsO5kGR4EtREtkZrQ9qHNSAzHprKEHavwtEZ3DqU7'
});

Mandrill.config({
  username: "connor@checkmatecreations.com",  // the email address you log into Mandrill with. Only used to set MAIL_URL.
  key: "-cN2vNGlJLhY2q7Rb9n8TA"  // get your Mandrill key from https://mandrillapp.com/settings/index
  // port: 587,  // defaults to 465 for SMTP over TLS
  // host: 'smtp.mandrillapp.com',  // the SMTP host
  // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
});
