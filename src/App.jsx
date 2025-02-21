import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { BoardContext } from './context/BoardContext';



function App() {
  const boardData = {
    active:0,
    boards:[
      {
        name:'Al Maryah Project',
        bgcolor:'#069',
        list:[
          {id:"1",title:"To Be Done",items:[{id:"cdrFt",title:"Project Description 1"}]},
          {id:"2",title:"In Progress",items:[{id:"cdrFv",title:"Project Description 2"}]},
          {id:"3",title:"Completed",items:[{id:"cdrFb",title:"Project Description 3"}]},
          {id:"4",title:"Can't Be Done",items:[{id:"cdrFb",title:"Project Description 4"}]},
          {id:"5",title:"Waiting",items:[{id:"cdrFb",title:"Project Description 5"}]}
        ]
      }
    ]
  }
  const [allboard,setAllBoard] = useState(boardData); 
  
  return (
    <>
    <Header></Header>
    <BoardContext.Provider value={{allboard,setAllBoard}}>
      <div className='content flex'>
        <Sidebar></Sidebar>
        <Main></Main>
      </div>
    </BoardContext.Provider>
    </>
  )
}

export default App
