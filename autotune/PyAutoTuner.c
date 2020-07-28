/* Copyright 2012, Eng Eder de Souza 

   This program is free software; you can redistribute it and/or modify        
   it under the terms of the GNU General Public License as published by        
   the Free Software Foundation; either version 2 of the License, or           
   (at your option) any later version.                                         
                                                                                
   This program is distributed in the hope that it will be useful,             
   but WITHOUT ANY WARRANTY; without even the implied warranty of              
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               
   GNU General Public License for more details.                                
                                                                                
   You should have received a copy of the GNU General Public License           
   along with this program; if not, write to the Free Software                 
   Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.  

*/

#include "mayer_fft.h"
#include "autotalent.h"

#define SCALE_ROTATE 0
#define FORM_CORR 0
#define FORM_CORR 0
#define LFO_QUANT 0
#define CONCERT_A 440.0
#define FIXED_PITCH 2.0
#define FIXED_PULL 0.1
#define CORR_STR 1.0
#define CORR_SMOOTH 0.0
#define PITCH_SHIFT 1.0
#define LFO_DEPTH 0.1
#define LFO_RATE 1.0
#define LFO_SHAPE 0.0
#define LFO_SYMM 0.0
#define FORM_WARP 0.0
#define MIX 1.0
#define CHUNK 32

main()
{
	// reference this https://github.com/ederwander/PyAutoTune/blob/master/PyAutoTuner.c
	// and this https://github.com/ederwander/PyAutoTune/blob/master/ForPy2X/Examples/FromFileAutoTune.py
	// open a file
	// read the frames of the audio file in some chunk size 4200 for instance
	// for each chunk, run processSamples(buffer, FrameSize);
	// NOW IMPORTaNT, buffer is a pointer, so we should set the bits we consume from the audio stream to this
	// when we feed it to the processSamples we know that the buffer will be altered inside this function
	// on completion, we append the buffer to a byte array and eventually write this collection to an mp3 or wav file.
	//
	//just
	float *buffer;
	float concert_a = 440.0;
	float fixed_pitch = 2.0;
	float fixed_pull = 0.1;
	float corr_str = 1.0;
	float corr_smooth = 0.0;
	float pitch_shift = 1.0;
	float lfo_depth = 0.1;
	float lfo_rate = 1.0;
	float lfo_shape = 0.0;
	float lfo_symm = 0.0;
	float form_warp = 0.0;
	float mix = 1.0;
	// you need to declare the type of data a pointer will be to allocate memory first
	// then assign like so
	// key = &supplied_key
	char *key;
	int fs, FrameSize, scale_rotate, lfo_quant, form_corr;

	instantiateAutotalentInstance(fs);
	// & assigns the address of concert_a, key, etc to their respective parameters.
	initializeAutotalent(&concert_a, "c", &fixed_pitch, &fixed_pull, &corr_str, &corr_smooth, &pitch_shift, &scale_rotate, &lfo_depth, &lfo_rate, &lfo_shape, &lfo_symm, &lfo_quant, &form_corr, &form_warp, &mix);

	processSamples(buffer, FrameSize);

	freeAutotalentInstance();
}
