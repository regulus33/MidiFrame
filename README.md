# Links 

https://medium.com/abraia/basic-video-editing-for-social-media-with-ffmpeg-commands-1e873801659







# Functionality 

command line app does two things:

creates a 60 minute video of random clips chosen based on color and / or  sound data.

The criteria for picking can be customized but the end product becomes a video clip connected to a parallel object listing timestamps and color/noise levels.

video = {
    spiky1: {
        time: 0.004s
    },
    still4: {
        7.987s
    }
}

spiky1 would be a timestamp where color data is the most varied and sounds are above a certain threshhold amount. 

Still would be the opposite. Least color vareity with low sound. 

Now we stich the random video together and store it in memory. The only processing will be converting midi data to a video hash table to reposition the video playhead in real time. 

Ultimately we will be able to do the same with static midi-files. The end product should be enclosed in a box and have three main controls:


type: json-object
note_mapping: c1 = "red", c2 = "blue"


type: function
generate_source: generates a new randomized video file. 


type: float
minimum_clip_length: How long should the clips be? If they are under a millisecond and a note's decay is longer we might see a the screen change to a new random stitche's beginning timestamp.

type: json-object
trigger_hierarchy: specify which midi channels are given prioroty. Technically only one video clip can play at a time, so we decide which ones will take priority in the midi-signal. example:

    a in channel one has not finished playing while be comes in!

  channels:
  1:  a------
  2:   b--------- 
  3:    


In the hierarchy: 

channels = [1,2,3,4,5,6,7,8]

1 will never be cutoff by 2 becuase we've ordered them in the array. But we could change this, say we had drums in channels 5-8 and we wanted those sounds to override instruments, our array is like this now:

channels = [5,6,7,8,1,2,3,4]

we will give use ability to name their channels to make it more UX friendly. 


After these functions exist, extend api to some controller and implant into a pi. Add a screen and box. DONE! 

In the meantime. Research how to read midi data. How much cpu power needed? 


## Important Concepts:

Delta Time:

Delta time is a reliable timer that allows programs to update data independently of processing speed, network speed and information travel time. The best example of its use case is in a video game that receives calls from the network and needs to update the position of a character in a sensible way. If we skipped three frames of data due to a lag, the character shpuld still be three feet away from where they were before the lag. So we bind the position to the delta time. 

## Pulses per quarter note 

----



## More ideas:

move playhead around with html video, select a timestamp and commit the time stamp to an entire channel or a note on a channel. :))))))))

then submit the timestamp key vals

```
 '34:45' : {
    channel: 3,
    notes: [3,44,3]
 }

```

process, rinse and repeat. Take this data to concat new video. 
