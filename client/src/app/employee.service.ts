import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Employee } from './employee';
 
@Injectable({
 providedIn: 'root'
})
export class EmployeeService {
 private url = 'http://localhost:5200';
 private employees$: Subject<Employee[]> = new Subject();
 
 constructor(private httpClient: HttpClient) { }
 
 private refreshEmployees() {
   this.httpClient.get<Employee[]>(`${this.url}/api`)
     .subscribe(employees => {
       this.employees$.next(employees);
     });
 }
 
 getEmployees(): Subject<Employee[]> {
   this.refreshEmployees();
   return this.employees$;
 }
 
 getEmployee(id: string): Observable<Employee> {
   return this.httpClient.get<Employee>(`${this.url}/api/${id}`);
 }
 
 createEmployee(employee: Employee): Observable<string> {
   return this.httpClient.post(`${this.url}/api`, employee, { responseType: 'text' });
 }
 
 updateEmployee(id: string, employee: Employee): Observable<string> {
   return this.httpClient.put(`${this.url}/api/${id}`, employee, { responseType: 'text' });
 }
 
 deleteEmployee(id: string): Observable<string> {
   return this.httpClient.delete(`${this.url}/api/${id}`, { responseType: 'text' });
 }
}