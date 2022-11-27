'use strict';

class Cache{
    /* 
    *  Provides a storage mechanism for Request / Response object pairs that are cached
    */
    constructor (self){
        this.cache = [];
        this.maxCap = process.env.CAPACITY || 100;
        this.set = this.set.bind(this);
        this.delete = this.delete.bind(this);
        this.getItem = this.getItem.bind(this);   
    }

    /**
     * Check if the cache has space for at least 1 item. 
     * * @returns
     *  true or false
     *
    */
    hasSpace(){
        const res = this.cache.length < this.maxCap ? true : false;
        return res;
    }
    /**
     * Store a value for a specified request. 
     *
     * @param request -
     *   request to store value under
     * @param responce -
     *   value to store
     * @returns
     *  true or null if failed
     */
    set(request, responce){
        if (!request || !responce || this.cache.length === this.maxCap)
            return null;
        
		this.cache[request] = responce;
        // console.log("new item inserted to cache")

        return true;
        
	}
    /**
    * Set the cached value for the specified request if it exists. Will return
    * the true or `null` if no cached value exist.
    *
    * @param request -
    *   request to set new val to key
    * @returns
    *   true or `null`
    */
    //  setItem(url, responce){
    //     if (this.cache && url && responce && this.cache[url]){
    //         this.cache[url] = responce;
    //         return true;
    //     }  
    //     return null ;
    // }
    /**
    * Get the cached value for the specified request if it exists. Will return
    * the value or `null` if no cached value exist. Sets the counter to +1
    *
    * @param request -
    *   request to get
    * @returns
    *   current value or `null`
    */
    getItem(request){
        if (this.cache && request && this.cache[request]){
            console.log("cache hit")
            return this.cache[request];
        } 
        console.log("cache miss") 
        return null ;
    } 
    /**
     * Deletes the cached request & value for the specified request if it exists. Will return
     * true or `null` if no cached value exist. 
     *
     * @param request -
     *   request to delete
     * @returns
     *   true or `null`
     */ 
    delete(request) {
        if (this.cache && request && this.cache[request]){
            delete this.cache[request]; 
            return true; 
        } 
        return null ;
    }
    /**
	* Clear the cache removing all of the entries cached.
	*/
	clear(){
		this.cache = null;
	}

}
module.exports = new Cache();


