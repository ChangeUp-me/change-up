#!/bin/bash

# just make a 		$ chmod +x deploy.sh
# and run it with 	$ ./deploy.sh
# make sure you are meteor logged with Connor credentials
DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy test.changeup.me --settings ./settings.json
