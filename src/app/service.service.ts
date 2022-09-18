import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http : HttpClient) { }

  httppost(payload:any){
    return this.http.post("http://localhost:3000/student",payload)
  }
  httpput(payload:any,id:any){
    return this.http.put("http://localhost:3000/student/"+id,payload)
  }
  httpdelete(id:any){
    return this.http.delete("http://localhost:3000/student/"+id)
  }
  httpget(){
    return this.http.get("http://localhost:3000/student")
  }
}
