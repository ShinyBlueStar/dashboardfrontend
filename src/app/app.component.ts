import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from './task';
import { Subscription, delay, interval, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnDestroy, OnInit{
  title = 'dashboardfrontend';

  public tasks: Task[] = [];
  private subscription: Subscription | undefined;
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    console.log('process of fetching tasks from server started')
    this.getTasks();
    this.startTaskRefresh();

  }

  public getTasks(): void {
    console.log('getTask() started');
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
        console.log('method getTask() running. Fetched tasks:', data[0]);
      }
      // ,
      // (error: HttpErrorResponse) => {
      //   console.error('Error fetching tasks:', error);
      // }
    );
    console.log('finished getTask()');
  }

  private startTaskRefresh(): void {
    console.log('Task refresh interval started');
    this.subscription = interval(60000)
      .pipe(
        switchMap(() =>
          this.taskService.getTasks().pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Error in task refresh:', error);
              return of([]);
            })
          )
        )
      )
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        console.log('Tasks refreshed:', tasks);
      });
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
