import {
    reverseChannelsAndNotesObject,
    mergeArrays,
    getNotesFromChannelInSuppliedObject
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

test("mergeArrays() merges an array of 1 level deep arrays", () => {
  let newArray = mergeArrays([[1,2,3,4,5,6],[7,8,9,10]])
  expect(newArray).toEqual([1,2,3,4,5,6,7,8,9,10])
})

test("mergeArrays() merges an array of 1 level deep arrays", () => {
  let newArray = mergeArrays([[1,2,3,4,5,6],[7,8,9,10]])
  expect(newArray).toEqual([1,2,3,4,5,6,7,8,9,10])
})

test("getNotesFromChannelInSuppliedObject() gets the notes for the supplied channel which you give as a second argument :) kay?", () => {
  let channel = 5
  let notesOfChannel = [1,2,3,4,5]
  let objecty = {}
  objecty[5] = notesOfChannel
  let appropriateArray = getNotesFromChannelInSuppliedObject(objecty, 5)
  expect(appropriateArray).toEqual(notesOfChannel)
})

