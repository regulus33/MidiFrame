from struct import pack
from wave import open
import sys
import numpy as np
import AutoTune
import code
import datetime
import soundfile as sf
# from pydub import AudioSegment


#! python3 TuneAndPlayFromFile.py


def tune_file(input_file, key):
    print("input file : ", input_file)
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
    KEY = key.encode()
    CHUNK = 4096
    # code.interact(local=dict(globals(), **locals()))
    wf = open(input_file, 'rb')
    # name = '{time}.wav'
    # output_file = open(name, 'wb')

    # If Stereo
    if wf.getnchannels() == 2:
        print("Just mono files")
        sys.exit(0)
    NewSignal = []

    # Initialize PyAudio
    # pyaud = pyaudio.PyAudio()

    # Open stream
    # stream = pyaud.open(format=pyaudio.paFloat32,
    #                     channels=wf.getnchannels(),
    #                     rate=wf.getframerate(),
    #                     output=True)

    # read the entire array of audio data
    signal = wf.readframes(-1)

    FS = wf.getframerate()
    # exposes buffer interface if int16 array type thing (not sure how you would read an int as audio?)
    intsignal = np.frombuffer(signal, dtype=np.int16)
    # initial float value
    # not sure why he divides 2**15, is this an amplitude thing?
    floatsignal = np.float32(intsignal) / 2**15

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

    # for each CHUNK in total samples
    for i in range(0, len(floatsignal), CHUNK):
        SignalChunk = (floatsignal[i:i+CHUNK])
        # if we are at then end of the chunk,only read remaining samples in chunk
        if i+CHUNK > len(floatsignal):
            CHUNK = len(SignalChunk)
        print(SignalChunk)  # this is an array

        rawfromC = AutoTune.Tuner(SignalChunk, FS, CHUNK, SCALE_ROTATE, LFO_QUANT, FORM_CORR, CONCERT_A, FIXED_PITCH,
                                  FIXED_PULL, CORR_STR, CORR_SMOOTH, PITCH_SHIFT, LFO_DEPTH, LFO_RATE, LFO_SHAPE, LFO_SYMM, FORM_WARP, MIX, KEY)
        for s in rawfromC:
            NewSignal.append(s)

        print(".")

    array = np.array(NewSignal, np.float32)

    sf.write(input_file, array, FS, format='wav',
             subtype='FLOAT')

    # stop stream (4)

    # close PyAudio (5)
    # pyaud.terminate()
