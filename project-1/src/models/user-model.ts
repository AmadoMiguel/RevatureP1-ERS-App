export class User {
    userId:number;
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    role:string;
    constructor(obj:any) {
        this.userId = obj.userId;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.username = obj.username;
        this.email = obj.email;
        this.role = obj.role;
    }   
}