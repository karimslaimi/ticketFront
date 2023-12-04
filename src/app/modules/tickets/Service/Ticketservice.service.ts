import {Injectable} from '@angular/core';
import {ApiHandlerService} from "../../../core/shared/utils/api-handler.service";
import {API_ENDPOINTS, ApiMethod} from "../../../core/shared/utils/const";

@Injectable({
  providedIn: 'root'
})
export class TicketserviceService {

  constructor(private http: ApiHandlerService) { }


  getTickets(){
    return this.http.requestCall(API_ENDPOINTS.tickets, ApiMethod.GET,'');
  }

}
