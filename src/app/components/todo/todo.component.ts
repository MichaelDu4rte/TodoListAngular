import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})

export class TodoComponent implements OnInit  {

  // local storage save and use
  constructor() {
    effect(() => {
      localStorage.setItem('todo', JSON.stringify(this.todoList()));
    })
  }
  
  ngOnInit(): void {
    const storage = localStorage.getItem('todo');

    if(storage) {
      this.todoList.set(JSON.parse(storage));
    }
  }


  // filter default
   filter = signal<FilterType>('all');

  // todo new, form input validation rules 
  newTodo = new FormControl('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(3) ]} );

  // todo items
  todoList = signal<TodoModel[]>([
      {
        id: 1,
        title: "Comprar Comida",
        completed: false,
        editing: false,
      },
      {
        id: 2,
        title: "Ir a academia",
        completed: false,
        editing: false,
      },
      {
        id: 3,
        title: "Estudar",
        completed: false,
        editing: false,
      },
  ])

  // add todo new to array todoList
  addTodo() {
    const newTodoValue = this.newTodo.value;
    if (this.newTodo.valid) {

      const newTodoItem: TodoModel = {
        id: Date.now(), // Gerar um novo ID único
        title: newTodoValue,
        completed: false,
        editing: false,
      };
      
      this.todoList.update(todoList => [...todoList, newTodoItem]);
      
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  // change edit status for true or false
  editStatusActiveTodo(todo : TodoModel) {
    todo.editing = !todo.editing;
  }

  // edit todo
  saveEditTitleTodo(todoId : number, event : Event) {
    const title = (event.target as HTMLInputElement).value
    return this.todoList.update((prevAll) => prevAll.map((todo) =>{
      return todo.id === todoId ?  {...todo, title: title, editing: false}: todo;
    }))
  }

  // delete todo from todoList
  deleteTodo(todoId : number) {
    this.todoList.update((prevAll) =>
      prevAll.filter((todo) => todo.id !== todoId)
    );
  }

  // toggle status completed todo
  toggleTodo(todoId: number) {
    this.todoList.update((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
    
   // change filter
   changeFilter(filterString : FilterType) {
    this.filter.set(filterString);
  }

  // todoListFilter
  todoListFilter = computed(() => {
    const filter = this.filter();
    const todo = this.todoList();

    switch (filter) {
      case 'active':
        return todo.filter((todo) => !todo.completed);
      
      case 'completed':
        return todo.filter((todo) => todo.completed);
      
      default:
        return todo;
    }
    
  })

}
