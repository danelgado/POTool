import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {callObject} from '../injectables';
import {environment} from '../../environments/environment';


@Injectable()
export class PostsService {
    constructor(private http: Http){
        console.log('PostsService Initialized...');
    }
    
 
    sendCall(callType: string, callTo: string, callBody: string){
        if(!(callType.includes("GET") || callType.includes("POST")))
        {
           console.log('No callType available for '+ callType); 
        }
        else
        {
            let APICall = new callObject(callTo, callBody, callType);
            return this.APIBackendCall(APICall);
        }
    }


    APIBackendCall(APICall : callObject){
        console.log("LOG ::: Sending API call to APITool with value: ");
        var APIJson = JSON.stringify(APICall);
        console.log(APIJson);
        return this.http.post(environment.urlBackend, APIJson);
    }
}