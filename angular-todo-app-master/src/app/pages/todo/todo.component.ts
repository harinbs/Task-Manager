import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodoService } from '../../core/services/todo.service';
import { AuthService } from '../../core/services/auth.service';
import { ITodo, IResponse } from '../../core/models/todo.model';
import { ITodoStatus, TodoCardComponent } from '../../shared/components/todo-card/todo-card.component';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TodoCardComponent, SlidePanelComponent, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  todos: ITodo[] = [];
  todoStatus = ITodoStatus;
  isSlidePanelOpen = false;
  todoId: string | null = null;
  filterByStatus = '';
  username: string | null = null;

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('OPEN', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllTodos();
    this.username = this.authService.getUsername(); // Retrieve the username from the auth service
  }

  getAllTodos() {
    this.todoService.getAllTodo(this.filterByStatus).subscribe({
      next: (response: IResponse<ITodo[]>) => {
        this.todos = response.data;
      },
      error: (err: any) => {
        console.error('Error fetching todos:', err);
      }
    });
  }

  openSlidePanel() {
    this.isSlidePanelOpen = true;
    if (!this.todoId) {
      this.todoForm.reset({ status: 'OPEN' }); // Reset the form only when adding a new task
    }
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
    this.todoId = null; // Reset todoId when closing the panel
  }

  onFilterByStatus(status: string) {
    this.filterByStatus = status;
    this.getAllTodos();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (this.todoId) {
        this.todoService.updateTodo(this.todoId, this.todoForm.value).subscribe({
          next: (response: IResponse<ITodo>) => {
            this.getAllTodos();
            this.onCloseSlidePanel();
          },
          error: (err: any) => {
            console.error('Error updating todo:', err);
          }
        });
      } else {
        this.todoService.addTodo(this.todoForm.value).subscribe({
          next: (response: IResponse<ITodo>) => {
            this.getAllTodos();
            this.onCloseSlidePanel();
          },
          error: (err: any) => {
            console.error('Error adding todo:', err);
          }
        });
      }
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  onLoadTodoForm(item: ITodo) {
    this.todoId = item.id!;
    this.todoForm.patchValue({
      title: item.title,
      description: item.description,
      status: item.status,
    });
    this.openSlidePanel();
  }

  onDeleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.getAllTodos();
      },
      error: (err: any) => {
        console.error('Error deleting todo:', err);
      }
    });
  }

  trackById(index: number, item: ITodo): string {
    return item.id!;
  }
}