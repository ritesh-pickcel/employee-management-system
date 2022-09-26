import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-edit-employee',
  template: `
    <h2 class="text-center m-5">Edit an Employee</h2>
    <app-employee-form [initialState]="employee" (formSubmitted)="editEmployee($event)"></app-employee-form>
  `,
  styles: [
  ]
})
export class EditEmployeeComponent implements OnInit {
  employee: BehaviorSubject<Employee> = new BehaviorSubject({});
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeServices : EmployeeService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id){
      alert('No id recieved');
    }

    this.employeeServices.getEmployee(id !).subscribe((employee)=>{
      this.employee.next(employee);
    })
  
  }

  editEmployee(employee: Employee){
    this.employeeServices.updateEmployee(this.employee.value._id || '', employee)
    .subscribe({
      next:()=>{
        this.router.navigate(['employees']);
      },
      error:(err)=>{
        alert('Faield to update');
        console.error(err);
      }
    })
  }
}
