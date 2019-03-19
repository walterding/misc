/**
 * Created by hinotohui on 17/4/8.
 */

/*
协程库
*/

function yieldProcess1(){
    return new Promise((resolve,reject)=>{
        resolve('yield process1');
    })
}

function yieldProcess2(){
    return new Promise((resolve,reject)=>{
        resolve('yield process2');
    })
}

function* genTemplate() {
    let data1=yield yieldProcess1();
    let data2=yield yieldProcess2()
}

function gen() {
    let data1=(function(){return 'yield process1'})()
    let data2=(function(){return 'yield process2'})()
}

function coroutine(generator) {
    let gen=generator()

    function next(arg){
        let result=gen.next(arg)

        if(result.done)
            return

        result.value.then(next,function(err){
            console.log(err)
        })
    }

    next()
}

for(i=0;i<10000;i++) {
    coroutine(genTemplate);
}
