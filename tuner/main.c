/* main.c
    Autotalent driver program

    Copyright 2010 Ethan Chen

    This program is free software; you can redistribute it and/or modify        
    it under the terms of the GNU General Public License as published by        
    the Free Software Foundation; either version 2 of the License, or           
    (at your option) any later version.                                         
                                                                                                                          
    This program is distributed in the hope that it will be useful,             
    but WITHOUT ANY WARRANTY; without even the implied warranty of              
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               
    GNU General Public License for more details.                                
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sndfile.h>
#include "autotalent.h"
#include <errno.h>  // for errno
#include <limits.h> // for INT_MAX

#define BUF_SIZE 4098
#define CONCERT_A 440.0
#define KEY_C 'c'
#define FIXED_PITCH 0.0
#define FIXED_PULL 0.2
#define CORR_STR 1.0
#define CORR_SMOOTH 0.0
#define PITCH_SHIFT 0.0
#define SCALE_ROTATE 0
#define LFO_DEPTH 0.0
#define LFO_RATE 0.0
#define LFO_SHAPE 0.0
#define LFO_SYMM 0.0
#define LFO_QUANT 0
#define FORM_CORR 1
#define FORM_WARP 0.0
#define MIX 1.0

// convert argv input to sring for keys
int string_to_int(char *str)
{
  char *p;
  int num;

  errno = 0;
  long conv = strtol(str, &p, 10);

  // Check for errors: e.g., the string does not represent an integer
  // or the integer is larger than int
  if (errno != 0 || *p != '\0' || conv > INT_MAX)
  {
    // Put here the handling of the error, like exiting the program with
    // an error message
    exit(1);
  }
  else
  {
    // No error
    num = conv;
    printf("%d\n", num);
    return num;
  }
}

int main(int argc, char **argv)
{
  SNDFILE *ifp, *ofp;
  SF_INFO *if_info, *of_info;
  float concert_a = CONCERT_A;
  char key_c = KEY_C;
  float fixed_pitch = FIXED_PITCH;
  float fixed_pull = FIXED_PULL;
  float corr_str = CORR_STR;
  float corr_smooth = CORR_SMOOTH;
  float pitch_shift = PITCH_SHIFT;
  int scale_rotate = SCALE_ROTATE;
  float lfo_depth = LFO_DEPTH;
  float lfo_rate = LFO_RATE;
  float lfo_shape = LFO_SHAPE;
  float lfo_symm = LFO_SYMM;
  int lfo_quant = LFO_QUANT;
  int form_corr = FORM_CORR;
  float form_warp = FORM_WARP;
  float mix = MIX;
  int notes[12];
  // input file, outputfile plus 12 semitines
  if (argc != 15)
  {
    /* display not so helpful message */
    printf("Usage: autotalent <in file> <out file> 0 0 0 0 0 0 0 0 0 0 0 0\n");
  }
  else
  {
    if (strcmp(argv[1], argv[2]) != 0)
    {
      // ARGV 0,1,0,1, 0, 1
      notes[0] = string_to_int(argv[3]);
      notes[1] = string_to_int(argv[4]);
      notes[2] = string_to_int(argv[5]);
      notes[3] = string_to_int(argv[6]);
      notes[4] = string_to_int(argv[7]);
      notes[5] = string_to_int(argv[8]);
      notes[6] = string_to_int(argv[9]);
      notes[7] = string_to_int(argv[10]);
      notes[8] = string_to_int(argv[11]);
      notes[9] = string_to_int(argv[12]);
      notes[10] = string_to_int(argv[13]);
      notes[11] = string_to_int(argv[14]);
      /* open input files through libsndfile */
      if_info = (SF_INFO *)calloc(1, sizeof(SF_INFO));
      ifp = sf_open(argv[1], SFM_READ, if_info);

      if (ifp != NULL)
      {
        /* open output file */
        of_info = (SF_INFO *)calloc(1, sizeof(SF_INFO));
        of_info->samplerate = if_info->samplerate;
        of_info->channels = if_info->channels;
        of_info->format = if_info->format;
        ofp = sf_open(argv[2], SFM_WRITE, of_info);
      }
      else
      {
        printf("Unable to open input file!\n");
        exit(EXIT_FAILURE);
      }

      if (ofp != NULL)
      {
        /* set up autotalent */
        instantiateAutotalentInstance(if_info->samplerate);
        initializeAutotalent(&concert_a, notes, &fixed_pitch, &fixed_pull, &corr_str, &corr_smooth, &pitch_shift, &scale_rotate, &lfo_depth, &lfo_rate, &lfo_shape, &lfo_symm, &lfo_quant, &form_corr, &form_warp, &mix);
        printf("autotalent initialized with samplerate %d\n", if_info->samplerate);

        /* set up buffer we're running through autotalent */
        int total_samples = 0;
        sf_count_t samples_read = 0;
        float *buf = (float *)calloc(BUF_SIZE, sizeof(float));

        do
        {
          /* read samples */
          samples_read = sf_read_float(ifp, buf, BUF_SIZE);
          total_samples += samples_read;

          /* run buffer through autotalent */
          processSamples(buf, samples_read);

          /* write to output file */
          int samples_written = sf_write_float(ofp, buf, samples_read);

        } while (samples_read > 0);

        free(buf);
        freeAutotalentInstance();
        sf_close(ifp);
        sf_close(ofp);
      }
      else
      {
        printf("Unable to open output file!\n");
        exit(EXIT_FAILURE);
      }
    }
    else
    {
      /* we can't read and write to the same file, sorry */
      printf("attempting to write to the same file!\n");
      exit(EXIT_FAILURE);
    }
  }

  return 0;
}
