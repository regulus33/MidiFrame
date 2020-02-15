describe("MIDI BOT", function () {
  let called = false

  const midiAccess = {
    outputs: {
      get: (deviceId) => {
        return {
          send: (message) => called = true
        }
      }
    }
  }


  beforeEach(function () {
    called = false 
  })

  it("calcClockSignalsBeforeDone, should pass ", function () {
    // const midiBot = new MidiBot()
    // expect(midiBot.calcClockSignalsBeforeDone(1)).toBe(96)
  })

  it("sendMessage, should pass", function () {

  
    let options = { midiAccess: midiAccess }
    
    const midiBot = new MidiBot(options)

    midiBot.sendMessage([234])

    expect(called).toBe(true)
  })

  it("play, should pass", function () {
    
    let called = false
    let bot = new MidiBot({midiAccess:midiAccess})
    bot.sendMessage = (e) => e[0] === 250 ? called = true : null 
    bot.play()

    expect(called).toBe(true)
  })

  it("stop, should pass", function () {
    
    let called = false
    let bot = new MidiBot({midiAccess:midiAccess})
    bot.sendMessage = (e) => e[0] === 252 ? called = true : null 
    bot.stop()

    expect(called).toBe(true)
  })

  it("record, should pass", function () {
    
    let bot = new MidiBot({midiAccess:midiAccess})
    bot.record()

    expect(bot.recording).toBe(true)
  })

  it("onMidiMessage, should pass", function () {

    const progressBar = document.getElementById('progress')
    
    let bot = new MidiBot({midiAccess: midiAccess, progressBar: progressBar})

    bot.recording = true 

    bot.sendMessage = () => {
      called = true 
    }

    bot.onMidiMessage({data:[248]})

    expect(called).toBe(true)
    expect(bot.clockCount).toBe(1)
    expect(progressBar.value).toBe(1)
    
  })


  it("Setup saves all UI controls into instance variables", function () {
       const botInstance = setup().initializeUI()
       expect(botInstance.clockSignalsBeforeDone).toBe(384)       
  })


  it("", function () {
    const botInstance = setup().initializeUI()
    expect(botInstance.clockSignalsBeforeDone).toBe(384)       
})


 



  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });

  //   it("should indicate that the song is currently paused", function() {
  //     expect(false).toBeFalsy();

  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });

  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });

  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);
  //     calcClockSignalsBeforeDone(30000)
  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });
});
