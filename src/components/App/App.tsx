import { useState, useEffect, useCallback } from 'react'

import Form from '../Form/Form'
import '../../index.css'
import empty from '../../assets/empty.svg'
import emptyDark from '../../assets/empty-dark.svg'

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const putTodo = (value: string): void => {
    try {
      if (value.trim()) {
        setTodos([...todos, {
          id: Date.now(),
          text: value.trim(),
          done: false
        }])
      } else {
        console.debug('Empty todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  const toggleTodo = useCallback((id: number) => {
    setTodos(todos.map(todo => {
      if (todo.id !== id) return todo;
      return {
        ...todo,
        done: !todo.done
      }
    }))
  }, [todos]);

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const saveTodos = (todos: Todo[]) => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const loadTodos = (): Todo[] => {
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  };

  const isValidTodo = (todo: any): todo is Todo => {
    return (
      typeof todo === 'object' &&
      typeof todo.id === 'number' &&
      typeof todo.text === 'string' &&
      typeof todo.done === 'boolean'
    );
  };

  return (
    <>
      <div id="container" className="bg-white dark:bg-[#252525] min-h-screen min-w-full flex justify-center w-full">
        <div id="wrapper" className="flex flex-col w-full max-w-[850px] items-center justify-center mt-14 px-14">
          <h1 className="dark:text-white uppercase text-center text-4xl font-medium mb-8">ToDo LiSt</h1>
          <Form putTodo={putTodo} />

          <ul className="flex flex-col w-[80%] max-w-[75%] mt-6 mb-20 text-left">
            {todos.length === 0 ? (
              <li className="flex flex-col items-center justify-center">
                <img src={empty} className="select-none w-[300px] h-[300px] mx-auto block dark:hidden" />
                <img src={emptyDark} className="select-none w-[300px] h-[300px] mx-auto hidden dark:block" />
                <span className="dark:text-white text-xl text-black text-center py-4">Empty...</span>
              </li>
            ) : (
              
              todos.map(todo => {
                return (
                  <li key={todo.id} className="flex flex-row items-center justify-between border-b border-[#6C63FF]">

                    <div className="flex flex-row items-center">
                      <input type="checkbox" className="peer min-w-6 h-6 w-6 cursor-pointer transition-all appearance-none rounded-sm border border-[#6C63FF] checked:bg-[#6C63FF]" onChange={() => toggleTodo(todo.id)}/>
                      <span className={todo.done ? "break-all text-xl font-medium p-3 text-[#25252550] dark:text-[#ffffff50] line-through" : "break-all text-xl font-medium p-3 text-black dark:text-white"} >{todo.text}</span>
                    </div>

                    <div className="flex flex-row items-center">

                      <button className="delete-button p-2" onClick={() => deleteTodo(todo.id)}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path className="delete-icon transition-all duration-200" d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" stroke="#CDCDCD"/>
                          <path className="delete-icon transition-all duration-200" d="M14.625 3.75H3.375" stroke="#CDCDCD" strokeLinecap="round"/>
                          <path className="delete-icon transition-all duration-200" d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" stroke="#CDCDCD"/>
                          <path className="delete-icon transition-all duration-200" d="M10.5 9V12.75" stroke="#CDCDCD" strokeLinecap="round"/>
                          <path className="delete-icon transition-all duration-200" d="M7.5 9V12.75" stroke="#CDCDCD" strokeLinecap="round"/>
                        </svg>
                      </button>

                    </div>

                  </li>
                )
              })
            )}
          </ul>

        </div>
      </div>
    </>
  )
}

export default App
