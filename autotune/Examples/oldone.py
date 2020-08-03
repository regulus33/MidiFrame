from struct import pack
from wave import open
import pyaudio
import sys
import numpy as np
import AutoTune
import code
import datetime
import soundfile as sf
FORM_CORR = 0
SCALE_ROTATE = 0
LFO_QUANT = 0
CONCERT_A = 440.0
FIXED_PITCH = 2.0
FIXED_PULL = 0.1
CORR_STR = 1.0
CORR_SMOOTH = 0.6
PITCH_SHIFT = 0.0
LFO_DEPTH = 0.1
LFO_RATE = 1.0
LFO_SHAPE = 0.0
LFO_SYMM = 0.0
FORM_WARP = 1.0
MIX = 1.0
KEY = "c".encode()
CHUNK = 4096

#! python3 TuneAndPlayFromFile.py

wf = open('teste.wav', 'rb')
time = datetime.datetime.now()
name = '{time}.wav'
output_file = open(name, 'wb')


# If Stereo
# if wf.getnchannels() == 2:
#     print("Just mono files")
#     sys.exit(0)
NewSignal = []

# Initialize PyAudio
pyaud = pyaudio.PyAudio()


# Open stream
stream = pyaud.open(format=pyaudio.paFloat32,
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True)

# read the entire array of audio data
signal = wf.readframes(-1)
FS = wf.getframerate()
# exposes buffer interface if int16 array type thing (not sure how you would read an int as audio?)
intsignal = np.frombuffer(signal, dtype=np.int16)
# initial float value
# not sure why he divides 2**15, is this an amplitude thing?
floatsignal = np.float32(intsignal) / 2**15
# me setting the output file
# channels = wf.getnchannels()
# frame_rate = wf.getframerate()
# total_frames = wf.getnframes()
# sample_width = wf.getsampwidth()

# output_file.setnchannels(channels)
# output_file.setframerate(FS)
# output_file.setsampwidth(sample_width)

out_params = [None, None, None, None, None, None]
in_params = wf.getparams()
# I want to have a mono type wave file in output. so I set the channels = 1
out_params[0] = 1
out_params[1] = 4  # Sample width aka PCM32 (which the output will always be)
out_params[2] = in_params[2]  # Sample Rate
out_params[3] = in_params[3]  # Number of Frames
out_params[4] = in_params[4]  # Type
out_params[5] = in_params[5]  # Compressed or not
output_file.setparams(out_params)

# print('channels: ', channels)
# print('frame_rate: ', frame_rate)
# print('total_frames: ', total_frames)
# print('sample_width: ', sample_width)
# 2 which is in bytes not bits

#  means 16-bit sample width, meaning each sample (or in this case since its mono)
# Frames, will be a 16 bit value
# soxi teste.wav
# Input File     : 'teste.wav'
# Channels       : 1
# Sample Rate    : 22050
# Precision      : 16-bit
# Duration       : 00:00:20.01 = 441177 samples ~ 1500.6 CDDA sectors
# File Size      : 882k
# Bit Rate       : 353k
# Sample Encoding: 16-bit Signed Integer PCM

# output_file.setparams(wf.getparams())
# for each sample in the CHUNK


for i in range(0, len(floatsignal), CHUNK):
    # Singal = chunk
    SignalChunk = (floatsignal[i:i+CHUNK])
    # if we are at then end of the chunk,only read remaining samples in chunk
    if i+CHUNK > len(floatsignal):
        CHUNK = len(SignalChunk)
    # print(floatsignal)  #
    #  this is an array
    print(SignalChunk)  # this is an array
    # run the tuner
    rawfromC = AutoTune.Tuner(SignalChunk, FS, CHUNK, SCALE_ROTATE, LFO_QUANT, FORM_CORR, CONCERT_A, FIXED_PITCH,
                              FIXED_PULL, CORR_STR, CORR_SMOOTH, PITCH_SHIFT, LFO_DEPTH, LFO_RATE, LFO_SHAPE, LFO_SYMM, FORM_WARP, MIX, KEY)
    for s in rawfromC:
        NewSignal.append(s)
    # create a bytes object containing the bytes of this piece of audio data
    # for s in rawfromC:
        # if s != 0.0:
        # code.interact(local=dict(globals(), **locals()))
    out = pack("%df" % len(rawfromC), *(rawfromC))

    stream.write(out)
    # print(out)

    # output_file.writeframesraw(out)
    print(".")


array = np.array(NewSignal, np.float32)

array.dtype = np.int16
# code.interact(local=dict(globals(), **locals()))

output_file.writeframes(array)

# stop stream (4)
stream.stop_stream()
stream.close()

# close PyAudio (5)
pyaud.terminate()
