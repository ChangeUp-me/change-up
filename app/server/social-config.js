//facebook
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '428054590735812',
    secret: 'ebb47e81cbd0daf35a689bfccf19ccde'
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

Twit = new TwitMaker({
    consumer_key:         "YwKomwgv4jhRstUdQiAq6eCY3"
  , consumer_secret:      '9jyIsLgcApdeW4iHeO7g0HwIMZStDpK2IYtofuHUdXP5A48cno'
  , access_token:         '2654569926-nlPmDCderq26uDxNLG2Ia1WU6aHVi9IoxlUvrzA'
  , access_token_secret:  'YW4WqUesBKAeZVR84dVSSMpS3KQkphCeXi8Qm7eNlXeaF'
});