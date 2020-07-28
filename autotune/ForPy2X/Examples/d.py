#Copyright (c) 2012, Eng Eder de Souza
#AutoTune from Wav File Example!
import faulthandler; faulthandler.enable()
import sys
import numpy
import scikits.audiolab as audiolab 
import AutoTune
import code
import wave, struct

FORM_CORR=0
SCALE_ROTATE=0
LFO_QUANT=0
CONCERT_A=440.0
FIXED_PITCH=2.0
FIXED_PULL=0.1
CORR_STR=1.0
CORR_SMOOTH=0.0
PITCH_SHIFT=1.0
LFO_DEPTH=0.1
LFO_RATE=1.0
LFO_SHAPE=0.0
LFO_SYMM=0.0
FORM_WARP=0.0
MIX=1.0
KEY="c"
CHUNK=32

NewSignal=[]

if len(sys.argv)<3 :
        print 'Usage: %s <Input audio file.wav> <Output audio file.wav>' %sys.argv[0]
        sys.exit(0)

IN=sys.argv[1]
OUT=sys.argv[2]





f = audiolab.Sndfile(IN, 'r')

FS = f.samplerate
nchannels  = f.channels

# 459609
datas = f.read_frames(CHUNK, dtype=numpy.float32)
# 439129
total_frames = f.nframes 
total_frames_read = 0

while total_frames > total_frames_read:
	print "."
	
	Signal = datas.data[:]
	code.interact(local=dict(globals(), **locals()))
	rawfromC=	
	code.interact(local=dict(globals(), **locals()))
	
	for s in rawfromC:
		NewSignal.append(s)
	
	if total_frames_read >= total_frames:
		break
	# the next chunk will put us over the limit, make chunk whatever remaining frames count is 
	elif (total_frames_read + CHUNK) > total_frames:
		# last chunk will always be less than CHUNK 
		last_chunk = (total_frames - total_frames_read) 
		datas = f.read_frames(last_chunk, dtype=numpy.float32)
		total_frames_read += last_chunk
		break
	else:
		code.interact(local=dict(globals(), **locals()))
		datas = f.read_frames(CHUNK, dtype=numpy.float32)
		total_frames_read += CHUNK

	
	
	
	
	


array = numpy.array(NewSignal)

fmt         = audiolab.Format('wav', 'pcm32')



# making the file .wav
afile =  audiolab.Sndfile(OUT, 'w', fmt, nchannels, FS)



#writing in the file
afile.write_frames(array)

print "Done!"


