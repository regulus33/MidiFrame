# baseline docker image. Has python 3 installed 
FROM python:3

WORKDIR /usr/src/app

COPY . .

EXPOSE 5000

RUN apt-get update

RUN apt-get -y install python-dev python-numpy python-setuptools libsndfile-dev

RUN pip install numpy   

RUN pip install soundfile

RUN pip install flask

RUN apt-get -y install vim

RUN python setup.py install

WORKDIR /usr/src/app/

# RUN flask run --host=0.0.0.0

CMD ["python", "./app.py"]

# install depdendencies 
# RUN pip install --no-cache-dir -r requirements.txt 


#command for running the app 
# CMD ["python", "./app.py"]


# RUN apt-get -y install python-dev python-numpy python-setuptools libsndfile-dev

# RUN pip install scikits.audiolab

