# August 3rd 2020 

## Invoicehome:
Today I finished off a bit of taxes and items updates that I needed to catch up on in the iOS flutter app. 
To sync Taxes and Items screens with Brad's "2 compound taxes on 1 item" error fix I simply 
duplicated all the widgets into the ios folders where they belong and made re-edited the screens with 
cupertino layouts. It was just easier and probably safer than hunting down the relevant methods and embedded logic 
inside the UI. This has been my technique for much of the Android code that needs to be copied to iOS. It is often simpler to 
begin from scratch than to edit an existing monolith, especially when there are  a lot of conditional statements and weird exceptions. 

Anyway, for that It was just monkey testing by hand on simulators and my physical device. 

I had missed a few borders here and there and had made one of the text inputs higher than it was before... 

After that I jumped back into Rails, downloaded DBeaver which is all the rage among us devs. Its a simple UI layer over
postgres (or whatever DB is your thing). Its a bit like Postman is an abstraction of CURL. Well, DBeaver is a totally free abstraction over SQL. 

I had accidently commented out Rails master key in my profile so it took me a bit of time to get going in Rails but eventually I 
kicked things off and was ready to program in ruby again. Once I had the Rails app up and running I realized I needed to run the open office server again. I went back to the original Wiki written by Nick which was very helpful, now I have the necessary commands to spinup our Docker instance aliased into my bash profile. 

I briefly reviewed the script for recurring invoices which is all embeded in the model. I merged the latest changes from master into the recurring invoices branch with no issues. I will need to continue the review tomorrow and keep in mind any further optimizations or safety nets we can build into the feature... However, its important not to mislead the team into thinking I'm not confident about the functionality. Both Lukas and I have worked extensively on it and tested it manually and automatically. The biggest step now is to get it live and react to the public, adapt and iterate. 

Later in the day I added the WipeCache function call in our Upgrade Screen to make sure that the plan data is never stale when users
move to that screen. 

I also added logic that displays the upgrade button + plan pricing *only* if the user is **not** on the free plan. 

Before, a paid user could still upgrade, even when they were already subscribed because we were only deciphering free or paid based on whether they were on the ios plan specifically and not based on the general notion of whether the user is simply paid or free. 

## Midiframe and life:
So, I've finally come to a point where I have implemented every technical requirement/feature/dream I've had for MidiFrame. This is the first app that I've ever written alone. Its a huge accomplishment and I'm quite proud of my work. I've been toiling over this work late at night and weekends for about one year now. 

It seems like every time I get close to finishing this app, I find one more tiny feature to add. The midi recording function is not 
very reliable. Now I'm unsure about where the problem lays. It could easily be a clocking issue in my test device as the midi clock in the opz is said to be terribly unreliable and inconsistent. To be truthful I don't know why its happening but more and more I feel like this live midi recording, while it was a big accomplishment development wise, its not very useful to me or the end user. 

Soooo...  

The very last feature is a drag and drop midi function that parses a standard midi file and generates a recording based on the notes contained therein. 

This opens the app upp quite a bit more and gives it a new angles. It can be seen more as an automatic video generator and less as a performance, composition tool. This could be beneficial because I am not satisfied with the latency when midi notes call different frames in the video... To speed up the live aspect we will need to write some low level C code and index the video frames into some kind of buffer... Some day! But for now this is good enough. And its very easy to get started. Just go to midiframe.com on chrome and plug your device in or drag and drop a midifile. 

Anyway, it would be really really really really cool. Especially if we could drop the midi file in, read it on the client side 
and "player piano it" right there in the video tag. 

So that will take another 2 weeks... In the meantime I should be able to deploy something to AWS. I've been studying docker and containing the rails app and autotune functions to two separate containers should streamline everything quite well. The first success would be to run both severs from Docker locally. If we can do that, BOOM. 

After that we will need to do some housekeeping... Validations, review security stuff and filter ips for requests only from my home. 

We need to test the app in the wild to see performance. After all, we may need to limit the video upload size to 100mb or so just to guarantee a smooth workflow. Hey, find me one artist who hasn't said that limitations have a special place in their heart. 

Lastly, unrelated to development. I am working on an OPZ review and performance. Very excited about the footage and song. I ended up learning so much about ableton in the process ironically so now the video feels like an ableton review. I want the video to be maximalist and on par with something I would create with a pen or with a daw. In other words: IM TAKING MY TIME! 

Part of me wants to rush this but another part just wants me to be proud of my work and being proud of my work is what keeps me in the habit of creating. Never sacrifice quality for delivery speed. Finish your work, but FINISH your work! 

So no deadline or timeline on that video but next step is to do a rough edit. More like a sequential draft that we can destroy and pull apart more and more over time. :)

# August 4th Midnight 

## learning C late at night 

I have been trying to wrap my head around pointers in C for the last couple of hours. I think I learned something though:
```c
#include <stdio.h>
#include <stdlib.h>

void pointerFunction(int* thing){
    printf("%d",*thing); // 1
    printf("%d",&thing); // 11715269224 (address)
    printf("%d",thing); // 1-1384539592-1384539556 ??
}

int main() {
    int* pointer_to_integer;
    
    int integer_value = 1;
    
    pointer_to_integer = &integer_value;
    
    pointerFunction(pointer_to_integer);
    
    return 0;
}
```

`*` gets the value and `&` gets the pointer. I think its uncommon to not use & or * when dealing with 
a pointer. See the third `printf` in `pointerFunction()` not sure what that does at all? is there some 
mathematical relationship that I'm missing? Is this an address of an address? 

So after reading some more Dennis Ritchie on C I hit this chapter about pointers and arrays and how they're similar.

ok.....

But then I realized that inside of autotalent, the most confusing thing to me about the code was how a buffer could be 
edited and modified if by the dsp loop if all we seemed to be passing was a pointer to a single float. 

But, apparantly, when you pass the first element of an array to pointer like 

```c 
float *array_element__first
```

the memory in an array is organized in such a way, that logically, by incrementing the pointer ++1 we will be at the next index in the array 
apparantly this is faster which makes sense since we don't need to ask the array for the value at some index and can instead step through the 
array's memory address piece by piece. This is like the core underlying principle of key value optimizations. 

Damn I feel so smaaat. 

If someone ever finds these logs they should release as a free pdf called "idiot pretends to be leonardo davinci while trying to understand computers"

But anyway... looks like we can write this autotune feature as a raw executable now instead of setting it up in fucking python. 

```c
in summary
a[i] == *(a+i)
```
And here from our autotunce genius' DSP loop:

```c
   for (lSampleIndex = 0; lSampleIndex < SampleCount; lSampleIndex++)
  {

    // load data into circular buffer
    // HERE HE INCREMENTS THE MEMORY ADDRESS OF THE BUFFER 
    tf = (float)*(pfInput++);
    ...
```

From Dennis Ritchie 

`pa = &a[0];`
pa and a have identical values. Since the name of an array is a synonym for the location of the initial element, the assignment `pa=&a[0]` can also be written as `pa = a;`



