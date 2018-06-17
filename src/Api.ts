import { promises } from "fs";
import memoizee from "memoizee";




export class Api{

    constructor(){

    }

    define<T,K>(func:(...any)=>T){

        let args:any[]=[];
        let callback:K=((..._args:any[])=>{
            _args.forEach(a=>args.push(a));
        }) as any;

        let level=()=>func(...args);
        return new ApiChain<T,K>(level,callback);
    }
    
    static Singleton<K>(func:()=>K){
        let single = memoizee(func) as typeof func;
        return new Api().define(single);
    }

    static Replace<Y,Z>(builder:ApiChain<Y,Z>,func:()=>Y){
        return this.Mock(builder,func);
    }


    static Mock<X,Y>(builder:ApiChain<X,Y>,func:()=>Partial<Y>){
        return ApiChain.Mock(builder,func)
    }


    static Merge<left,lr,lf=(...any:any[])=>any>(api1:ApiChain<left,lf>,ctor?:lf){
        function With<right,rr,rf>(api2:ApiChain<right,rf>,ctor2?:rf){
            debugger;
            return new Api().define((...args)=>{

                let call1:any = ctor?ctor:(...any:any[])=>[];
                let call2:any = ctor2?ctor2:(...any:any[])=>[];
                let arg1 = call1(...args);
    
                let arg2 = call2(...args)  

                let r1 = api1.factory.Create(...arg1)
                let r2 = api2.factory.Create(...arg2)


                return {...r1 as any,...r2 as any} as typeof r1 & typeof r2

            })
            //return new Merge<left,lr,right,rr,lf,rf>(api1,api2,ctor,ctor2);
        }

        return {
            With
        }
        
    }



    // static Input<K>(ctor:K){

    // }
}




export class ApiChain<Base,Ctor=(...any:any[])=>any>{


    constructor(protected level:()=>Base,private ctor:Ctor){

    }



    public use<K>(func:(base:Base)=>K){
        return new ApiChain<K,Ctor>(()=>func(this.level()),this.ctor)
    }



    get factory(){

        let self = this;
        let Create:(...any:any[])=>Base; 
        
    
        let thing = function(...args){
            (self as any).ctor(...args);
            return self.level()
        } as any as (...any:any[])=>Base

        Create = thing as any;
        return {
            Create
        }
    }


    static Mock<X,Y>(builder:ApiChain<X,Y>,func:()=>Partial<Y>){
        let real  = builder.level;

        builder.level = func as any;

        return ()=>{
            builder.level = real;
        }
    }


   

}



class Merge<left,lr,right,rr,lf=()=>lr,rf=()=>rr,Merge=left&lr&right&rr>{
    constructor(private api1:ApiChain<left,lr>,private api2:ApiChain<right,rr>,private ctor1?:lf,private ctor2?:rf){
        
    }




    define<J,L,K=()=>J,M=()=>L>(func:(input:Merge)=>J){

        let first;
        let second;
        let combine = ()=>({...first,...second});
        
        let f:(...any)=>J = (...any:any[])=>func(combine());

        let newCtor=(...args)=>{
            let call1:any = this.ctor1?this.ctor1:(...any:any[])=>[];
            let call2:any = this.ctor2?this.ctor2:(...any:any[])=>[];
            let arg1 = call1(...args);

            let arg2 = call2(...args)

            first = this.api1.factory.Create(...arg1);
            second = this.api2.factory.Create(...arg2);
            return f(...args) as any as L
        }

        let chain = new ApiChain<J,L>(f,newCtor as any);



        return chain;
    }
}