//like vuex
function Store(obj) {
    this.$proto=obj
    this.state={}

    for (let k in obj.state||{}){
        Object.defineProperty(this.state,k,{

            configurable:true,
            enumerable:true,

            set:function (v) {
                obj.state[k]=v
            },

            get:function () {
                return obj.state[k]
            }
        })
    }

    this.getter={}
    for (let k in obj.getter||{}){
        Object.defineProperty(this.getter,k,{

            configurable:false,
            enumerable:true,

            get:function () {
                return obj.getter[k](obj.state)
            }
        })
    }

    this.mutations=obj.mutations||{}
}

Store.prototype.commit=function(...args){
    if(this.mutations[args[0]]){
        this.mutations[args[0]].apply(this,args.slice(1))
    }
}


let store=new Store({

    state:{
        'todo':[1]
    },

    getter:{
        todoLength:(state)=>{
            return state['todo'].length
        }
    }
})

store.state.todo=[]





