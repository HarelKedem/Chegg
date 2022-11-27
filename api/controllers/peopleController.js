'use strict';
const {callHandler, callLimiter} = require('./api')

const BASE_URL = 'https://swapi.dev/api/people';

async function getCars(cars_unfilterd){
    console.log("cars request: ", cars_unfilterd)
    let cars = [];
    try{
        cars_unfilterd.forEach(car => cars.push(callLimiter(callHandler,car)));
        let filtered_cars = cars ? await Promise.allSettled(cars) : null;
        if(filtered_cars){
            filtered_cars.filter(promise => promise.status === 'fulfilled');
        }
        let res = filtered_cars.map(promise => promise.value);
        return res
    }catch(e){
        console.log(e);
        return null;
    }   
}

async function getPerson(url){
    try{
        let person  = await callLimiter(callHandler,url);
        console.log("person from call handler: ", person);
        if (person && person.vehicles){
            let result = {
                name: person.name,
                height:person.height,
                gender: person.gender,
            };
            let cars = person.vehicles ? await getCars(person.vehicles) : null;
            let f_cars = cars ?cars.filter(car=>car.crew >=2) : null;
            if (f_cars){
                result = {...result,
                vehicles: f_cars.map(car => car.name)
                }
                return result;
            }
        }else{
            return false;
        }
    }catch(err){
        // throw new Error('unable to load person')
    }
}
/**
 * handles route /api/people/:id
 *  
 * */ 
async function getById (req,res,next){
    const id = req.params.id;
    if (!id) return false;
    try{
        let url = BASE_URL + `/${id}`
        console.log("request for person id: ", id);
        let result = await getPerson(url);
        res.status(200).json(result);    
    }catch(err){
        // next(err);
    }
};
/**
 * builds a person object
 *  
 * */        
async function getPagedCar(pag){
    let results = [];
    pag.map(resPage=>{
        resPage.results.map(res=>{
                     let person = {
                         name: res.name,
                         height: res.height,
                         gender: res.gender,
                         vehicles: res.vehicles
                         }
                      results.push(person);
         }); 
     });
     return results;
}

/**
 * handles route /api/people
 *  
 * */
async function getPeople (req,res,next){
    console.log('request for all people')
    let results = [];
    let nextPage = BASE_URL;
    let people = [];
    try{
        //iterate next pages
        while (nextPage) {
        let nextres = await callLimiter(callHandler,nextPage)
        nextPage = nextres.next
        people = [...people, nextres]
        } 
        let pag_result = await Promise.all(people);
        results = await getPagedCar(pag_result)
        let f_res = results ? results.filter(res=> res.vehicles.length>0) :null
        //get cars
        let full_res =  await Promise.all(
            f_res.map(async(res)=> {res.vehicles = await getCars(res.vehicles); return res})
            );
        let resolved = full_res.map(person=>{ let p = person; p.vehicles =person.vehicles.map(car=>car.name); return p} )
        res.status(200).json(resolved)
    }catch(err){
        // next(err)
    }
}
 
module.exports ={
    getById,
    getPeople,
}