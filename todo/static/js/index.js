buildList()

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
let activeItem = null;
let list_snapshot = []

async function buildList(){

    const wrapper = document.getElementById('list-wrapper');
    // wrapper.innerHTML = '';

    var url = "http://localhost:8000/api/task-list/"

    await fetch(url)

    .then(async (result) => {
        const tasks = await result.json();
        var list = tasks;
        for(var i in list){
            try{
                document.getElementById(`data-row-${i}`).remove()
            }catch(err){

            }

            let title = `<span class="title">${list[i].title}</span>`

            if(list[i].completed == true){
                title = `<strike class="title">${list[i].title}</strike>`
            }

            var item = `
            <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                <div style="flex:1">
                <input type="checkbox" class="status_check" aria-label="">
                </div>
                <div style="flex:7">
                    ${title}
                </div>
                <div style="flex:1">
                    <button class="btn btn-sm btn-outline-info edit">Edit </button>
                </div>
                <div style="flex:1">
                    <button class="btn btn-sm btn-outline-dark delete">Delete</button>
                </div>
            </div>
            `
            wrapper.innerHTML += item;

        }

        if (list_snapshot.length > list.length){
            for (let i = list.length; i < list_snapshot.length; i++){
                document.getElementById(`data-row-${i}`).remove()
            }
        }

        list_snapshot = list

        for(let i in list){
            let editButton = document.getElementsByClassName('edit')[i];
            let deleteButton = document.getElementsByClassName('delete')[i];
            let status_check = document.getElementsByClassName('status_check')[i];

            editButton.addEventListener("click", function(){
                editItem(list[i]);
            })

            deleteButton.addEventListener("click", function(){
                deleteitem(list[i]);
            })

            status_check.addEventListener("click", function(){
                strikeUnstrike(list[i]);
            })
        }
    })
    .catch((err) => {
        console.log(err)
    });
}


const form_wrapper = document.getElementById('form-wrapper');

form_wrapper.addEventListener('submit', async (e)=>{
    e.preventDefault();
    console.log('form submitted');

    var url = "http://localhost:8000/api/task-create/"
    var title = document.getElementById('title').value;
    const form = document.getElementById('form');

    if(activeItem!=null){
       var url = `http://localhost:8000/api/task-update/${activeItem.id}/`
       activeItem = null;
    }

    const data = {
        'title' : title,
        'completed' : false
    }

    var options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify(data)
    }

    await fetch(url, options)
    .then(async (response)=>{
        buildList();
        form.reset();
        
    }).catch((err)=>{
        console.log(err);
    })
})

function editItem(item){
    console.log(item);
    activeItem = item;
    document.getElementById('title').value = activeItem.title;
}

async function deleteitem(item){
    console.log("delete clicked");
    console.log(item);

    var url = `http://localhost:8000/api/task-delete/${item.id}/`
    var options = {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken
        }
    }

    await fetch(url, options)
    .then(async (response)=>{
        buildList();
        form.reset();
        alert(`Task "${item.title}" deleted successfully!`);
        
    }).catch((err)=>{
        console.log(err);
    })
}

async function strikeUnstrike(item){
    console.log("striked/unstriked");
    console.log(item);

    var url = `http://localhost:8000/api/task-update/${item.id}/`
    item.completed = !item.completed;

    const data = {
        'title' : item.title,
        'completed' : item.completed
    }

    var options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRFToken': csrftoken
        },
        body : JSON.stringify(data)
    }

    await fetch(url, options)
    .then(async (response)=>{
        buildList();
        // document.getElementById(`data-row-${}`)
        form.reset();
        
    }).catch((err)=>{
        console.log(err);
    })
}
