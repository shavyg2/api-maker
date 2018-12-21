import { Api } from "./Api";
import contains from "is-subset";

describe("Api Test",()=>{

    let api = new Api();


        let array_api = api.define(api_name=>{

            let storage = [] as any[];

            return storage;
            
        })
        
        let DatabaseApi = array_api.use((base)=>{

                function create(item){
                    base.push(item)
                }

                function has(query){
                    return base.some(item=>contains(item,query))
                }

                function find(query){
                    return base.filter(item=>has(query))
                }

                function get(query){
                    return find(query)[0];
                }


                function remove(query){
                    find(query).forEach(item=>{
                        let i = base.indexOf(item)

                    })
                }

                return {create,has,get,find,remove}
        }).factory;
        
    it("should be able to create an api",()=>{
            let db=  DatabaseApi.Create()
            let user = {
                name:"bob",
                age:25
            }

            db.create(user);


            expect(db.has({
                name:"bob"
            })).toBe(true);


            let bob = db.get({
                name:"bob"
            })

            expect(bob).toBe(user)

            
    })

    describe("Nested Api",()=>{


        let DatabaseFactory = new Api().define(name=>{
            return DatabaseApi.Create()
        }).factory



        let User = DatabaseFactory.Create()
        let Team = DatabaseFactory.Create()



        it("should be independent",()=>{

            User.create({name:"jill"})

            let result = Team.find({name:"jill"})

            expect(result.length).toBe(0);



            result = User.find({
                name:"jill"
            })


            expect(result.length).toBe(1);


        })




    })




    describe("Async Test",()=>{


        let AsyncApi = new Api().define(async ()=>{

            return {
                sayHi(){
                    return "hi"
                }
            }


        }).use(async(hiGenerator)=>{
            let hi = await hiGenerator;



            return {
                sayHello(name:string){
                    return `${hi.sayHi()} ${name}`
                }
            }
        }).factory

        it("should be able to work with async",async ()=>{

                let api  = await AsyncApi.Create()

                expect(api.sayHello("james")).toBe("hi james")

        })
    })




    describe("Extend API",()=>{

        let numberApi = new Api().define(()=>{




            return {
                one(){
                    return 1
                },
                two(){
                    return 2
                }
            }

        }).use(base=>{



            return {
                ...base,three(){
                    return 3
                }
            }
        }).factory



        it("should call one",()=>{
            let api = numberApi.Create()


            expect(api.one()).toBe(1);
            expect(api.two()).toBe(2);
            expect(api.three()).toBe(3)

        })


    })




    describe("MergeApi",()=>{

        let OneApi = new Api().define(()=>{
            return {
                one(){
                    return 1
                }
            }
        })



        let TwoApi =  new Api().define(()=>{
            return {
                two(){
                    return 2
                }
            }
        })


        let ThreeApi = Api.Merge(OneApi).With(TwoApi).use(merged=>{

            return {
                three(){
                    
                    return merged.one()+ merged.two()
                }
            }
        })



        it("should be able merge different apis",()=>{
            let threeApi = ThreeApi.factory.Create()

            expect(threeApi.three()).toBe(3)
        })



        it("should be able to manipulate merge args",()=>{

                let Person = new Api().define((name:string)=>{
                    return {
                        getName(){
                            return name;
                        }
                    }
                })

                let Age = new Api().define((age:number)=>{


                    return {
                        getAge(){
                            return age
                        }
                    }
                })


                let Character = Api.Merge(Person,(name:string,age:number)=>[name]).With(Age,(name:string,age:number)=>[age])

                let c= Character.use((man)=>{
                        return man;
                }).factory.Create("bob",25);

                expect(c.getName()).toBe("bob");
                expect(c.getAge()).toBe(25);

        })
    })



    describe("Mocking",()=>{

        let SadApi = new Api().define(()=>{
            return {
                getFace(){
                    return ":("
                }
            }
        })


        it("should be able to turn that found upside down",()=>{
            let api = SadApi.factory.Create()
            
            expect(api.getFace()).toBe(":(");

            /**
             * It's called Mock but really it can replace core functionality
             */

            let undo = Api.Mock(SadApi,()=>{
                return {
                    getFace(){
                        return ":)" as any;
                    }
                }
            })


            api = SadApi.factory.Create()
            expect(api.getFace()).toBe(":)")



            //Back to reality

            undo();

            api = SadApi.factory.Create()


            expect(api.getFace()).toBe(":(") //oh no!! atleast it passes

        })
    })



    describe("Singleton Objects",()=>{
        let once = Api.Singleton(()=>{
            return {};
        })


        let api = new Api().define(()=>{
            return {
                    getSingleton(){
                        return once.factory.Create()
                    }
            };
        })


        it("should be able to create a singleton",()=>{
            let first = api.factory.Create();
            let second = api.factory.Create();
            
            expect(first).not.toBe(second);
            expect(first.getSingleton()).toBe(second.getSingleton())
        })

    })

    describe("Should be able to pass args",()=>{

        let api = new Api().define((name:string)=>{

            return {
                name
            }
        }).use(item=>{
            return {
                speak(){
                    return "hello i am, "+item.name
                }
            }
        }).factory


        it("should be able to get args",()=>{

            let chatter = api.Create("james")

            let result = chatter.speak()
            expect(result).toBe("hello i am, james")
        })


    })
})



let dateFormat = new Api().define(string=>{




    return {

    }

})



class person{

    
}