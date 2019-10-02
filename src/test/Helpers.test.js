import {
    reverseChannelsAndNotesObject
  } from '../Helpers.js'


  test("reverseChannelsAndNotesObject() Inverts object its passed", () => {
    const testObject = {
        43 : ["1","2"],
        46 : ["1"],
        48 : ["1"]
    }
    let newObject = reverseChannelsAndNotesObject(testObject)

    expect(newObject).toEqual({"1":[43,46,48], "2":[43]})
})

