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

// https://stackoverflow.com/questions/59278688/compiling-python-3-extension-module-on-mac

#include "mayer_fft.h"
#include "autotalent.h"

void tunerboi(int fs, int FrameSize, int scale_rotate, int lfo_quant, int form_corr, float concert_a, float fixed_pitch, float fixed_pull, float corr_str, float corr_smooth, float pitch_shift, float lfo_depth, float lfo_rate, float lfo_shape, float lfo_symm, float form_warp, float mix, char key, float *buffer)

{

    // float *buffer, concert_a, fixed_pitch, fixed_pull, corr_str, corr_smooth, pitch_shift, lfo_depth, lfo_rate, lfo_shape, lfo_symm, form_warp, mix;
    // char *key;
    // int fs, FrameSize, scale_rotate, lfo_quant, form_corr;
    // args are positional, you take the value at each position and load the pointers up with the values
    // return NULL;
    // set frame size inside an array, not sure why?
    // npy_intp ArrLen[1] = {FrameSize};
    // allow multithreading?
    // Py_BEGIN_ALLOW_THREADS;
    // make an instance of autotalent
    instantiateAutotalentInstance(fs);
    // create some semblance of a c array from the input frames
    // PyArrayObject *x_array = PyArray_FROM_OTF(In_object, NPY_FLOAT, NPY_IN_ARRAY);
    // if (x_array == NULL)
    // {
    //     Py_XDECREF(x_array);
    //     return NULL;
    // }
    // this is a guess, but... convert the x_array python thingy to a float pointer buffer thing
    buffer = (float *)buffer;

    initializeAutotalent(&concert_a, &key, &fixed_pitch, &fixed_pull, &corr_str, &corr_smooth, &pitch_shift, &scale_rotate, &lfo_depth, &lfo_rate, &lfo_shape, &lfo_symm, &lfo_quant, &form_corr, &form_warp, &mix);

    processSamples(buffer, FrameSize);
    freeAutotalentInstance();
}
