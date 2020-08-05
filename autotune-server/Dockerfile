# baseline docker image. Has python 3 installed 
FROM python:3

# preoare to download through apt get 
RUN apt-get update

# yes to all questions and install dependency for transfer of audio files 
# libsndfile1
RUN apt-get -y install libsndfile-dev 

RUN pip install numpy 

RUN apt-get -y install python-dev python-numpy python-setuptools libsndfile-dev

RUN pip install faulthandler

RUN pip install pyaudio 

RUN apt-get -y install vim

# set the app directory for the app 
WORKDIR sys /usr/src/app

EXPOSE 5000

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container, this copies all files existing in dir above
COPY . .

WORKDIR /usr/src/app/PyAutoTune/

# CMD ['python', 'setup.py', 'install']

RUN python setup.py install

WORKDIR /usr/src/app/PyAutoTune/Examples/ 


# install depdendencies 
# RUN pip install --no-cache-dir -r requirements.txt 

# expose port number for http 
EXPOSE 5000

#command for running the app 
# CMD ["python", "./app.py"]


# RUN apt-get -y install python-dev python-numpy python-setuptools libsndfile-dev

# RUN pip install scikits.audiolab

