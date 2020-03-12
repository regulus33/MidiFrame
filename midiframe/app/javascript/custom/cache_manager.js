import {CACHE_NAME} from './constants'


export const myCache = () => caches.open( CACHE_NAME )

export const requestObject = ( uri ) => {
  return uri
}

export const responseObject = ( blob ) => {
  return new Response( blob )
}

export const requestFromCache = async( request ) => {
  let    cache    = await myCache()
  let    response = await cache.match( request )
  return response 
}

export const saveResponseInCache = async( requestString, blob ) => {
  let cache = await myCache()
  debugger 
  cache.put(
    responseObject( requestString ),
    responseObject( blob )
  )
}







