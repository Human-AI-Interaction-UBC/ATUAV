# Eye Movement Data Analysis Toolkit (EMDAT)

EMDAT is a library for processing eye gaze data, developed in the University of British Columbia. Currently EMDAT is able to use data exported from Tobii studio and SMI software for analysis. While Tobii studio and SMI enable researchers to perform limited analysis on the eye gaze data collected by an eye tracker in an experiment, EMDAT can be used to calculate a comprehensive list of eye gaze features for each participant. Additionally, EMDAT has built-in mechanisms for data preprocessing and clean up which makes it a valuable toolkit for researchers. EMDAT is developed with generalizability in mind, so that it can be used for a variety of experiments, with no or minimal amount of changes in the code provided. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to run EMDAT you need the following software: 

- [Python 2.7] (https://www.python.org/download/releases/2.7/)
- [Pip] (https://pip.pypa.io/en/stable/installing/)
- [Virtualenv] (https://virtualenv.pypa.io/en/stable/installation/)


### Installation

First make sure to create and activate a [virtualenv] (https://virtualenv.pypa.io/en/stable/userguide/)
    
Then install the dependencies:
    
    pip install -r requirements.txt
    
### Running
    
You can now run the application:

    python emdat_web/manage.py runserver


## Deployment

Before deploy this application in emdat_web/settings/settings.py switch the DEBUG variable to FALSE.

If you want to deploy this application on a server we recommend use Apache and mod_wsgi. This is the easiest, fastest, and most stable deployment choice. 

Follow the next steps to deploy EMDAT:

1. Collect all the static files (CSS, JS, Images & Fonts) with the next command:

        python manage.py collectstatic
    
    This command collects static files from all of the emdat_web/apps folder into a single location that can easily be served in production.
    
2. Edit your Apache server’s httpd.conf file with the path to the wsgi.py file and the static folder generated in the previous step.

    We provide an example of this configuration in httpd_conf_example.txt


## License

This project is licensed under --- see the LICENSE.md file for details
