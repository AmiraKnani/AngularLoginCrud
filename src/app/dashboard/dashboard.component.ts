import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALSTORAGE_LOGIN_ACCESS_TOKEN } from '../app.module';
import { AuthService } from '../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: AuthService, public dialog: MatDialog,private router: Router) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((users: any[]) => {
      this.users = users;
    });
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe(() => {
          this.fetchUsers();
        });
      }
    });
  }

  openUpdateUserModal(user: any): void {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result).subscribe(() => {
          this.fetchUsers();
        });
      }
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.fetchUsers();
    });
  }

  /**
   * Logs current user out
   */
  logout() {
    localStorage.removeItem(LOCALSTORAGE_LOGIN_ACCESS_TOKEN);
    this.router.navigate(['../../']);
  }
}