describe("MIDI BOT", function () {

  beforeEach(function () {
    let newThing = 0
  })

  it("calcClockSignalsBeforeDone, should pass ", function () {
    expect(calcClockSignalsBeforeDone(1)).toBe(96)
  })

  it("sendMessage calls the output from midiaccess", function () {
    let called = false
    midiAccess = {
      outputs: {
        get: (deviceId) => {
          return {
            send: (message) => called = true
          }
        }
      }
    }
    sendMessage([234])

    expect(called).toBe(true)
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
