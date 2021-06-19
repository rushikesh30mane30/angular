import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataServService } from '../data-serv.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  myControl = new FormControl();
  myAddControl = new FormControl();
  myCompControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  addrFilteredOptions: Observable<string[]>;
  companyFilteredOptions: Observable<string[]>;
  valA = 5;

  public employeeList = [];
  public deletedEmployeeList = [];
  public empId = null;
  public name = '';
  public address = {};
  public street = '';
  public suite = '';
  public city = '';
  public zipcode = '';
  public company = '';
  public modalRef: BsModalRef;
  public isEdit = false;
  constructor(private dataService: DataServService, private modalService: BsModalService) { }
  ngOnInit() {
    this.getAllEmployeeList();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.addrFilteredOptions = this.myAddControl.valueChanges.pipe(
      startWith(''),
      map(value => this._addFilter(value))
    );
    debugger;

    this.companyFilteredOptions = this.myCompControl.valueChanges.pipe(

      startWith(''),
      map(value => this._compFilter(value))
    );

  }


  getAllEmployeeList() {
    this.dataService.getAllEmployeeList().subscribe((data) => {
      this.employeeList = data;
    })
  }
  addEmp(template) {
    this.isEdit = false;
    this.openModal(template)
  }
  editEmp(template, emp) {
    this.empId = emp.id;
    this.name = emp.name;
    this.street = emp.address.street;
    this.suite = emp.address.suite;
    this.city = emp.address.city;
    this.zipcode = emp.address.zipcode;
    this.company = emp.company.name;
    this.isEdit = true;

    this.openModal(template)
  }
  deleteEmp(emp) {
    this.employeeList.splice(this.employeeList.findIndex(a => a.id === emp.id), 1)
    this.deletedEmployeeList.push(emp)
  }
  restoreEmp(emp) {
    this.deletedEmployeeList.splice(this.deletedEmployeeList.findIndex(a => a.id === emp.id), 1);
    this.employeeList.push(emp);
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  submit() {
    let emp = {
      id: this.employeeList.length + 1,
      name: this.name,
      address: {
        street: this.street,
        suite: this.suite,
        city: this.city,
        zipcode: this.zipcode,
      },
      company: {
        name: this.company,
      }
    }
    this.employeeList.push(emp);
    this.resetValue();
    this.modalRef.hide()

  }
  update() {
    let index = this.employeeList.findIndex(a => a.id === this.empId)
    this.employeeList[index].name = this.name;
    this.employeeList[index].address.street = this.street;
    this.employeeList[index].address.suite = this.suite;
    this.employeeList[index].address.city = this.city;
    this.employeeList[index].address.zipcode = this.zipcode;
    this.employeeList[index].company.name = this.company;
    this.resetValue();
    this.modalRef.hide()

  }
  resetValue() {
    this.name = '';
    this.street = '';
    this.suite = '';
    this.city = '';
    this.zipcode = '';
    this.company = '';
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let list = this.employeeList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    this.employeeList = list;
    return list;
  }
  private _addFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    let list = this.employeeList.filter(option => option.address.street.toLowerCase().indexOf(filterValue) === 0);
    this.employeeList = list;
    return list;
  }
  private _compFilter(value: string): string[] {
    debugger;
    const filterValue = value.toLowerCase();

    let list = this.employeeList.filter(option => option.company.name.toLowerCase().indexOf(filterValue) === 0);
    this.employeeList = list;
    return list;
  }
}
