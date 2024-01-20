import {Component, ViewContainerRef} from '@angular/core';
import {ConfirmationComponent} from "../../../core/shared/components/confirmation/confirmation.component";
import Swal from "sweetalert2";
import {HttpClient} from "@angular/common/http";
import {TicketserviceService} from "../Service/Ticketservice.service";

@Component({
  selector: 'app-ListTicket',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListTicketComponent {

  constructor(
    private http: HttpClient,
    private ticketService: TicketserviceService,
    private viewContainer: ViewContainerRef
  ) {

  }

  allTicket: any = [];
  userForm: any;
  editPopup: boolean;
  errors: any = [];
  formError: any = {};



  getTicketList() {
    this.ticketService.getTickets().subscribe({
      next: (data: any) => {
        this.allTicket = data;
      },
      error: (error: any) => console.log(error)
    })
  }

  delete(i: any) {
    const dialogRef = this.viewContainer.createComponent(ConfirmationComponent)
    dialogRef.instance.visible = true;
    dialogRef.instance.action.subscribe(x => {
      if (x) {
        this.ticketService.deleteTicket(i.id)?.subscribe(
          {
            next:(res)=>{
              dialogRef.instance.visible = false;
              Swal.fire({
                title: '',
                text: 'User Deleted Successfully',
                icon: 'success',
                confirmButtonText: 'Close'
              }).then(()=>this.getTicketList())
            },
            error:(error)=>{
              Swal.fire({
                title: 'Error!',
                text: 'There is an error from backend side.\n' + error,
                icon: 'error',
                confirmButtonText: 'Close'
              }).then(r =>console.log(r))
            }
          })
      }
    })
  }
  read(i: any) {
    this.userForm.patchValue(i);
    this.editPopup = true;
    // setTimeout(() => {
    //   this.popUpShowHideFlag = !this.popUpShowHideFlag;
    // }, 500);
  }
}
