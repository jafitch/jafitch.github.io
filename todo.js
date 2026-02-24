const todoList=document.querySelector('.todo-list')
const newtodo=document.querySelector('#new-todo')
const todos=JSON.parse(localStorage.getItem('todo-list'))||[{"text":"Brush my teeth","completed":false},
                                                            {"text":"Feed the dog","completed":false},
                                                            {"text":"Do the laundry","completed":false},
                                                            {"text":"Wash the car","completed":false}
]
const renderToDos=()=>{
    todoList.innerHTML=''
    todos.forEach(({text})=>{
        
        const li=document.createElement('li')
        li.textContent=text
        todoList.append(li)
    })
    
    
}
renderToDos()
const add=document.querySelector('#add-todo')
add.addEventListener('click',()=>{
    todos.push({text:newtodo.value,completed:false})
    localStorage.setItem('todo-list',JSON.stringify(todos))
    renderToDos()
    newtodo.value=""
})
