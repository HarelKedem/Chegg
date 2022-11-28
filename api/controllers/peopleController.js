'use strict';
const {callHandler} = require('./api')
const { enviorment, base_url, test_url } = require('../../config');

//to do :not fully implemented yet
const getUrlFromEnv = (path='') =>{ 
    let url = enviorment === 'development' ? base_url + path : test_url + path//should be backwords 
}

async function getCars(cars_unfilterd){
    console.log("cars request: ", cars_unfilterd)
    let cars = [];
    try{
        cars_unfilterd.forEach(car => cars.push(callHandler(car)));
        let filtered_cars = cars ? await Promise.allSettled(cars) : null;
        if(filtered_cars){
            filtered_cars.filter(promise => promise.status === 'fulfilled');
        }
        const res = filtered_cars.map(promise => promise.value);
        return res
    }catch(e){
        console.log(e);
        return null;
    }   
}
/**
 * handles route /api/people/:id
 *  
 * */
async function getPerson(url){
    try{
        const person  = await callHandler(url);
        console.log("person from call handler: ", person);
        if (person && person.vehicles){
            let result = {
                name: person.name,
                height:person.height,
                gender: person.gender,
            };
            const cars = person.vehicles ? await getCars(person.vehicles) : null;
            let f_cars = cars ?cars.filter(car=>car.crew >=2) : null;
            if (f_cars){
                result = {...result,
                vehicles: f_cars.map(car => car.name)
                };
                return result;
            }
        }else{
            return false;
        }
    }catch(err){
        return null;
    }
}
/**
 * handles route /api/people/:id
 *  
 * */ 
async function getById (req,res,next){
    const id = req.params.id;
    if (!id /*||typeof(id) != 'number'*/){
        res.status(400).send("bad request error 400")
    }
    try{
        const url =  base_url + `/${id}`  
        console.log("request for person id: ", id);
        const result = await getPerson(url);
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
            const person = {
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
    let nextPage = base_url;
    let people = [];
    try{
        //iterate next pages
        while (nextPage) {
        const nextres = await callHandler(nextPage)
        nextPage = nextres.next
        people = [...people, nextres]
        } 
        const pag_result = await Promise.all(people);
        results = await getPagedCar(pag_result)
        const f_res = results ? results.filter(res=> res.vehicles.length>0) :null
        //get cars
        const full_res =  await Promise.all(
            f_res.map(async(res)=> {res.vehicles = await getCars(res.vehicles); return res})
            );
        const resolved = full_res.map(person=>{ let p = person; p.vehicles =person.vehicles.map(car=>car.name); return p} )
        res.status(200).json(resolved)
    }catch(err){
        next(err)
    }
}
 
module.exports ={
    getById,
    getPeople,
}