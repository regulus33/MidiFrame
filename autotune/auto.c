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
// comPILE
//  gcc autotune.c autotalent.c mayer_fft.c -o tune -lm
#include "mayer_fft.h"
#include "autotalent.h"
#include <stdio.h>
#include <stdint.h>
#include <math.h>
#include "zuner.c"

int main()
{

// reference this https://github.com/ederwander/PyAutoTune/blob/master/PyAutoTunerboi.c
// and this https://github.com/ederwander/PyAutoTune/blob/master/ForPy2X/Examples/FromFileAutoTune.py
// open a file
// read the frames of the audio file in some chunk size 4200 for instance
// for each chunk, run processSamples(buffer, FrameSize);
// NOW IMPORTaNT, buffer is a pointer, so we should set the bits we consume from the audio stream to this
// when we feed it to the processSamples we know that the buffer will be altered inside this function
// on completion, we append the buffer to a byte array and eventually write this collection to an mp3 or wav file.
//
//just
#define N 128
#define FRAME_RATE 22050
    float buffer[N];
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
    // char *key;
    int fs, FrameSize, scale_rotate, lfo_quant, form_corr;

    // Launch two instances of FFmpeg, one to read the original WAV
    // file and another to write the modified WAV file. In each case,
    // data passes between this program and FFmpeg through a pipe.
    FILE *pipein;
    FILE *pipeout;
    pipein = popen("ffmpeg -i teste.wav -f s16le -ac 1 -", "r");
    pipeout = popen("ffmpeg -y -f s32le -ar 22050 -ac 1 -i - tuned.wav", "w");

    // Read, modify and write one sample at a time
    // int16_t sample;
    int count, n = 0;
    // instantiateAutotalentInstance(441177);
    // initializeAutotalent(&concert_a, "c", &fixed_pitch, &fixed_pull, &corr_str, &corr_smooth, &pitch_shift, &scale_rotate, &lfo_depth, &lfo_rate, &lfo_shape, &lfo_symm, &lfo_quant, &form_corr, &form_warp, &mix);

    while (1)
    {
        count = fread(&buffer, 2, N, pipein);
        printf("count is is: %d\n", count);
        // read one 2-byte sample
        if (count != N)
        {
            int samples_left = N - count;
            // & assigns the address of concert_a, key, etc to their respective parameters but they are pointers, not values
            // processSamples(buffer, FRAME_RATE);
            tunerboi(samples_left, FRAME_RATE, scale_rotate, lfo_quant, form_corr, concert_a, fixed_pitch, fixed_pull, corr_str, corr_smooth, pitch_shift, lfo_depth, lfo_rate, lfo_shape, lfo_symm, form_warp, mix, *"c", buffer);
            fwrite(buffer, 2, samples_left, pipeout);
            *buffer = 0;
            break;
        }

        // ++n;
        printf("looping");
        // ** AUTOTALENT ** //
        // & assigns the address of concert_a, key, etc to their respective parameters but they are pointers, not values
        tunerboi(N, FRAME_RATE, scale_rotate, lfo_quant, form_corr, concert_a, fixed_pitch, fixed_pull, corr_str, corr_smooth, pitch_shift, lfo_depth, lfo_rate, lfo_shape, lfo_symm, form_warp, mix, *"c", buffer);
        fwrite(buffer, 2, N, pipeout);
        *buffer = 0;

        // ** AUTOTALENT ** //
    }

    // Close input and output pipes
    pclose(pipein);
    pclose(pipeout);
    freeAutotalentInstance();
}
