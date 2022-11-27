'use strict';
const Cache = require('./cache')

    let frequencies = [];

    function increaseFrequency(url, res){
        let new_res = res;
        unsetFrequency(new_res.frequency, url);
        new_res.frequency += 1;
        setFrequency(new_res.frequency, url);
        // Cache.set(url, new_res);
    }

    async function request(url, apiWrapper){
        console.log("cache attempt:", url)
        if (url){
            let res = Cache.getItem(url);
            if (res){
                increaseFrequency(url, res)
                return res.responce
            }else{
                res = await getSet(url, apiWrapper); 
                return res.responce;
            }
           
        }else{
            throw new Error('bad request') 
        }

    }

    function deleteLeastFrequent(){
        let counter = clear_capacity;
        while(counter > -1){
            frequencies[counter].forEach(url => {
                Cache.delete(url);
            });
            frequencies[counter] = [];
            counter -= 1
        }
    }
    
    function findIndex(arr, url){
        arr.findIndex(object => {
            return object === url;
          });
    } 

    function  unsetFrequency(val,url){
        if (val && url && frequencies[val]){
            frequencies[val].pop(findIndex(frequencies[val],url));
            return true;
        }else{
            return false;
        }
    }


    function setFrequency(val,url){
        frequencies[val] ? frequencies[val].push(url) : () =>{
            frequencies[val] =[];
            frequencies[val].push(url)
        }
    }
    
    
     /**
    * Saves anew value to the cahce. Will clean least frequent entries if no space in cache. Will return
    * the value or `null` if no cached value exist.
    *
    * @param url -
    *   request to set new val to key
    * @param apiWrapper -
    *   function to call if item is missing in cache
    * @returns
    *   value of the Set or `null`
    */
    function setNew(url, responce){
        if (!Cache.hasSpace()){
            deleteLeastFrequent();
        }
        let res = {
            responce: responce,
            frequency: 0
        }
        Cache.set(url,res);
        setFrequency(0,url);
        return res;
    }

     /**
    * Set a new value for the specified request by calling a function. Will return
    * the value or `null` if no cached value exist.
    *
    * @param url -
    *   request to set new val to key
    * @param apiWrapper -
    *   function to call if item is missing in cache
    * @returns
    *   value of the Set or `null`
    */
    async function getSet(url, apiWrapper){

        try{
            res = await apiWrapper(url);
            if (res){
                let result = setNew(url,res);
                return result;
            }else{
                return null;
            }
                
        }catch(e){
                throw new Error("error setting new tem in cache", e.message)
            //    console.log("erro setting new tem in cache", e.message) // Promise.reject(e)
        }    
    }


module.exports = request
