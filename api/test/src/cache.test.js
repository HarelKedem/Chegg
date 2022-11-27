const {expect, test} = require('@jest/globals');
const Cache = require('../../cahce/cache');
const mockstore = require('./mockstore');

describe('Cache', () => {
    let cache = Cache;
    let id;
    let msg;
  
    beforeEach(() => {
    //   cache = Cache
      id = 1
      msg = 'a message in the cache'
      cache.set(id, msg);
    })
  
    describe('exists?', () => {
      it('returns true when the message id exists', () => {
        expect(cache.getItem(id)).toBe(msg) // sanity check
        // note exists? is a private method so the call
        // to the method is made via array access
        expect(cache.getItem(id)).toBeTruthy()
      })
    })
    describe('addOrUpdate', () => {
      describe('adding a new message', () => {
        it('should add a new message to the cache', () => {
          var newmsg = 'a new message'
          expect(cache.getItem(2)).toBeFalsy()
          cache.set(2, newmsg)
          expect(cache.getItem(2)).toBeTruthy()
          expect(cache.getItem(2)).toBe(newmsg)
        })
      })
      describe('updating an existing message', () => {
        it('should update the message with the id to new message', () => {
          var newmsg = 'a new message'
          expect(cache.getItem(1)).toBe(msg) // the old message
          cache.set(1, newmsg)
          expect(cache.getItem(1)).toBe(newmsg)
        })
      })
    })
    describe('Cache', () => {
      describe('when existing message is read', () => {
        it('returns the message string', () => {
          expect(cache.getItem(id)).toBe(msg)
        })
      })
      // describe('when message is read that does not exist in the cache', () => {
      //   it('reads the message from the underlying store, updates the cache and returns that value', () => {
      //     var newmsg = 'a new message from store'
      //     // confirm that message id 2 does not yet exist in the store
      //     expect(cache.getItem(2)).toBeFalsy()
      //     // mock the underlying store read method to return a set message string
      //     mockstore.read = jest.fn((id) => newmsg)
      //     // expect the cache read to return the new message string
      //     expect(cache.getItem(2)).toBe(newmsg)
      //     // expect the cache to now contain a message for id 2
      //     expect(cache.getItem(2)).toBeTruthy()
      //   })
        // describe('and when the message also does not exist in the underlying store', () => {
        //   it('will return undefined and not update the cache', () => {
        //     mockstore.read = jest.fn((id) => undefined)
        //     expect(cache.getItem(2)).toBeUndefined()
        //     expect(cache.getItem(2)).toBeFalsy()
        //     expect(cache.getItem(2)).toBeUndefined()
        //   })
        // })
      })
    })
  //   describe('IStoreWriter', () => {
  //     beforeEach(()=> {
  //       cache.getItem = jest.fn()
  //     })
  //     describe('when message is saved', () => {
  //       it('saves to the cache and the underlying store', () => {
  //         cache.save(id, msg)
  //         expect(mockstore.save).toHaveBeenCalledWith(id, msg)
  //         expect(cache.getItem).toHaveBeenCalledWith(1, msg)
  //       })
  //     })
  //   })
  // })
  // })

