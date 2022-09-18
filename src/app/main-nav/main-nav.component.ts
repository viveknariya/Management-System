import { OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RecordsComponent } from '../records/records.component';
import { ServiceService } from '../service.service';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    displayedColumns: string[] = ['select','firstName', 'lastName', 'address', 'dob','std','gender','contact','action'];
    dataSource!: MatTableDataSource<any>;

    selection = new SelectionModel<any>(true,[]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,private breakpointObserver: BreakpointObserver,private service:ServiceService) {}
  ngOnInit(): void {
    let response = this.service.httpget();
    response.subscribe({
      next: (nxt:any) => {
        this.dataSource = new MatTableDataSource(nxt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err)
      }
    })

    
  }
  toggleAll(){
    if(this.selection.selected?.length == 3){ 
      this.selection.clear()
    }
    else{
      console.log(this.dataSource.data)
      this.selection.select(...this.dataSource.data)
    }
  }


  onSelect(r : any){
    this.selection.toggle(r);

    console.log(this.selection.selected)
  }

  openDialog() {
    this.dialog.open(RecordsComponent, {
      width: '60%',
    }).afterClosed().subscribe(val => {
      if(val === 'Save'){
        let response = this.service.httpget();
      response.subscribe({
      next: (nxt:any) => {
        this.dataSource = new MatTableDataSource(nxt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err)
      }
    })
      }
    })


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(row:any){
    this.dialog.open(RecordsComponent,{
      width:'60%',
      data:row
    }).afterClosed().subscribe(val => { 
      if(val === 'Update'){
        let response = this.service.httpget();
      response.subscribe({
      next: (nxt:any) => {
        this.dataSource = new MatTableDataSource(nxt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err)
      }
    })
      }
    })
  }

  onDelete(id : any){
    this.service.httpdelete(id).subscribe({
      next : (nxt) => {
        console.log(nxt)
      },
      error : (err) => {
        console.log(err)
      }
    })
    let response = this.service.httpget();
      response.subscribe({
      next: (nxt:any) => {
        this.dataSource = new MatTableDataSource(nxt);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
