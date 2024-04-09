const token = localStorage.getItem("token")
const username = localStorage.getItem("username")

const LocalStorage = {
    
   async getToken (){
       if(token){
           return token
       }
       return false
   },
   async getUserName (){
    if(username){
        return username
    }
    return false
}
}



export default LocalStorage;