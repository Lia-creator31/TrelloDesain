// import React, { useState, useContext } from 'react';
// import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather';
// import CardAdd from './CardAdd';
// import { BoardContext } from '../context/BoardContext';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// import AddList from './AddList';
// import Utils from '../utils/Utils';

// const Main = () => {
//     const { allboard, setAllBoard } = useContext(BoardContext);
//     const bdata = allboard.boards[allboard.active];

//     const [selectedItem, setSelectedItem] = useState(null);
//     const [newName, setNewName] = useState('');
//     const [description, setDescription] = useState('');
//     const [attachments, setAttachments] = useState([]);
//     const [popupOpen, setPopupOpen] = useState(false);

//     function onDragEnd(res) {
//         if (!res.destination) return;
//         const newList = [...bdata.list];
//         const s_id = parseInt(res.source.droppableId);
//         const d_id = parseInt(res.destination.droppableId);
//         const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
//         newList[d_id - 1].items.splice(res.destination.index, 0, removed);

//         let board_ = { ...allboard };
//         board_.boards[board_.active].list = newList;
//         setAllBoard(board_);
//     }

//     const openPopup = (item) => {
//         setSelectedItem(item);
//         setNewName(item.title);
//         setDescription(item.description || '');
//         setAttachments(item.attachments || []);
//         setPopupOpen(true);
//     };

//     const closePopup = () => {
//         setPopupOpen(false);
//         setSelectedItem(null);
//     };

//     const handleFileUpload = (event) => {
//         const files = Array.from(event.target.files).map(file => {
//             return { 
//                 type: file.type.startsWith('image/') ? 'image' : 'file', 
//                 name: file.name, 
//                 url: URL.createObjectURL(file) // URL untuk membuka file
//             };
//         });
//         setAttachments([...attachments, ...files]);
//     };
    
    

//     const handleAddLink = () => {
//         const link = prompt("Enter attachment link:");
//         if (link) setAttachments([...attachments, { type: 'link', name: link }]);
//     };

//     const handleSave = () => {
//         let newList = [...bdata.list];
//         newList.forEach(list => {
//             list.items = list.items.map(item => {
//                 if (item.id === selectedItem.id) {
//                     return { ...item, title: newName, description, attachments };
//                 }
//                 return item;
//             });
//         });
        
//         let board_ = { ...allboard };
//         board_.boards[board_.active].list = newList;
//         setAllBoard(board_);
//         closePopup();
//     };

//     const handleDeleteAttachment = (index) => {
//         const updatedAttachments = [...attachments];
//         updatedAttachments.splice(index, 1);
//         setAttachments(updatedAttachments);
//     };

//     const handleDeleteItemInPopup = () => {
//         let newList = [...bdata.list];
//         newList.forEach(list => {
//             list.items = list.items.filter(item => item.id !== selectedItem.id);
//         });
    
//         let board_ = { ...allboard };
//         board_.boards[board_.active].list = newList;
//         setAllBoard(board_);
//         closePopup(); // Tutup pop-up setelah item dihapus
//     };
    

//     return (
//         <div className='flex flex-col w-full' style={{ backgroundColor: `${bdata.bgcolor}` }}>
//             <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>
//                 <h2 className='text-lg'>{bdata.name}</h2>
//                 <div className='flex items-center justify-center'>
//                     <button className='bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center'>
//                         <UserPlus size={16} className='mr-2'></UserPlus>
//                         Share
//                     </button>
//                     <button className='hover:bg-gray-500 px-2 py-1 h-8 rounded'><MoreHorizontal size={16}></MoreHorizontal></button>
//                 </div>
//             </div>

//             <div className='flex flex-col w-full flex-grow relative'>
//                 <div className='absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden'>
//                     <DragDropContext onDragEnd={onDragEnd}>
//                         {bdata.list.map((x, ind) => (
//                             <div key={ind} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
//                                 <div className="list-body">
//                                     <div className='flex justify-between p-1'>
//                                         <span>{x.title}</span>
//                                         <button className='hover:bg-gray-500 p-1 rounded-sm'><MoreHorizontal size={16}></MoreHorizontal></button>
//                                     </div>
//                                     <Droppable droppableId={x.id}>
//                                         {(provided) => (
//                                             <div className='py-1' ref={provided.innerRef} {...provided.droppableProps}>
//                                                 {x.items.map((item, index) => (
//                                                     <Draggable key={item.id} draggableId={item.id} index={index}>
//                                                         {(provided) => (
//                                                             <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                                                                 <div className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
//                                                                     <span>{item.title}</span>
//                                                                     <button className='hover:bg-gray-600 p-1 rounded-sm' onClick={() => openPopup(item)}>
//                                                                         <Edit2 size={16}></Edit2>
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </Draggable>
//                                                 ))}
//                                                 {provided.placeholder}
//                                             </div>
//                                         )}
//                                     </Droppable>
//                                     <CardAdd getcard={() => { }}></CardAdd>
//                                 </div>
//                             </div>
//                         ))}
//                     </DragDropContext>
//                     <AddList getlist={() => { }}></AddList>
//                 </div>
//             </div>

//             {popupOpen && (
//                 <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-5 rounded-md w-96">
//                         <h3 className="text-2xl font-bold text-black">Edit Item</h3>
//                         <input className="border p-2 w-full mt-2 text-black" value={newName} onChange={(e) => setNewName(e.target.value)} />
//                         <h1 className="text-sm font-bold text-black">Description</h1>
//                         <textarea className="border p-2 w-full mt-2 text-black" placeholder="Add a description..." value={description} onChange={(e) => setDescription(e.target.value)} />
//                         <h1 className="text-sm font-bold text-black">Activities</h1>
//                         <div className="mt-2">
//                             <button className="text-white px-3 py-1 rounded mr-2" onClick={handleAddLink} style={{ backgroundColor: `${bdata.bgcolor}` }}>Add Link</button>
//                             <input type="file" multiple className="hidden" id="fileUpload" onChange={handleFileUpload} />
//                             <label htmlFor="fileUpload" className="text-white px-3 py-1 rounded cursor-pointer" style={{ backgroundColor: `${bdata.bgcolor}` }}>Upload File</label>
//                         </div>

//                         <ul className="mt-2">
//                             {attachments.map((att, index) => (
//                                 <li key={index} className="text-sm flex items-center justify-between">
//                                     <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
//                                         {att.type === 'image' ? (
//                                             <img src={att.url} alt={att.name} className="w-16 h-16 object-cover mr-2 cursor-pointer" />
//                                         ) : (
//                                             <div className="mr-2">📄</div>
//                                         )}
//                                         <span className="text-blue-500 underline cursor-pointer">{att.name}</span>
//                                     </a>
//                                     <button className="bg-red-500 text-white px-2 py-1 rounded ml-2" onClick={() => handleDeleteAttachment(index)}>🗑️</button>
//                                 </li>
//                             ))}
//                         </ul>


//                         <button className="bg-green-800 text-white px-3 py-1 rounded mt-2" onClick={handleSave}>Save</button>
//                         <button className="bg-black text-white px-3 py-1 rounded mt-2 ml-2" onClick={closePopup}>Close</button>
//                         <button className="bg-red-800 text-white px-3 py-1 rounded mt-2 ml-2" onClick={handleDeleteItemInPopup}>Delete</button>

//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Main;

// import React, { useState, useContext } from 'react';
// import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather';
// import CardAdd from './CardAdd';
// import { BoardContext } from '../context/BoardContext';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// import AddList from './AddList';

// const Main = () => {
//     const { allboard, setAllBoard } = useContext(BoardContext);
//     const bdata = allboard.boards[allboard.active];

//     const [selectedItem, setSelectedItem] = useState(null);
//     const [newName, setNewName] = useState('');
//     const [description, setDescription] = useState('');
//     const [attachments, setAttachments] = useState([]);
//     const [popupOpen, setPopupOpen] = useState(false);

//     // State for checklist
//     const [checklistTitle, setChecklistTitle] = useState('');
//     const [checklistItems, setChecklistItems] = useState([]);
//     const [checklistProgress, setChecklistProgress] = useState(0);

//     function onDragEnd(res) {
//         if (!res.destination) return;
//         const newList = [...bdata.list];
//         const s_id = parseInt(res.source.droppableId);
//         const d_id = parseInt(res.destination.droppableId);
//         const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
//         newList[d_id - 1].items.splice(res.destination.index, 0, removed);

//         let board_ = { ...allboard };
//         board_.boards[board_.active].list = newList;
//         setAllBoard(board_);
//     }

//     const openPopup = (item) => {
//         setSelectedItem(item);
//         setNewName(item.title);
//         setDescription(item.description || '');
//         setAttachments(item.attachments || []);
//         setPopupOpen(true);
//     };

//     const closePopup = () => {
//         setPopupOpen(false);
//         setSelectedItem(null);
//         // Reset checklist when closing popup
//         setChecklistTitle('');
//         setChecklistItems([]);
//         setChecklistProgress(0);
//     };

//     const handleFileUpload = (event) => {
//         const files = Array.from(event.target.files).map(file => {
//             return { 
//                 type: file.type.startsWith('image/') ? 'image' : 'file', 
//                 name: file.name, 
//                 url: URL.createObjectURL(file) 
//             };
//         });
//         setAttachments([...attachments, ...files]);
//     };

//     const handleAddLink = () => {
//         const link = prompt("Enter attachment link:");
//         if (link) setAttachments([...attachments, { type: 'link', name: link }]);
//     };

//     const handleSave = () => {
//         let newList = [...bdata.list];
//         newList.forEach(list => {
//             list.items = list.items.map(item => {
//                 if (item.id === selectedItem.id) {
//                     return { ...item, title: newName, description, attachments, checklist: { title: checklistTitle, items: checklistItems, progress: checklistProgress }};
//                 }
//                 return item;
//             });
//         });

//         let board_ = { ...allboard };
//         board_.boards[board_.active].list = newList;
//         setAllBoard(board_);
//         closePopup();
//     };

//     const handleDeleteAttachment = (index) => {
//         const updatedAttachments = [...attachments];
//         updatedAttachments.splice(index, 1);
//         setAttachments(updatedAttachments);
//     };

//     const handleDeleteItemInPopup = () => {
//         let newList = [...bdata.list];
//         newList.forEach(list => {
//             list.items = list.items.filter(item => item.id !== selectedItem.id);
//         });

//         let board_ = { ...allboard };
//         board_.boards[board_.active].list = newList;
//         setAllBoard(board_);
//         closePopup();
//     };

//     // Handle checklist functionality
//     const handleAddItemToChecklist = () => {
//         if (checklistTitle.trim() && checklistItems.length < 10) {
//             setChecklistItems([...checklistItems, { name: checklistTitle, checked: false }]);
//             setChecklistTitle('');
//         }
//     };

//     const handleToggleChecklistItem = (index) => {
//         const updatedItems = [...checklistItems];
//         updatedItems[index].checked = !updatedItems[index].checked;
//         setChecklistItems(updatedItems);

//         // Recalculate progress
//         const checkedItems = updatedItems.filter(item => item.checked).length;
//         setChecklistProgress((checkedItems / updatedItems.length) * 100);
//     };

//     return (
//         <div className='flex flex-col w-full' style={{ backgroundColor: `${bdata.bgcolor}` }}>
//             <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>
//                 <h2 className='text-lg'>{bdata.name}</h2>
//                 <div className='flex items-center justify-center'>
//                     <button className='bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center'>
//                         <UserPlus size={16} className='mr-2'></UserPlus>
//                         Share
//                     </button>
//                     <button className='hover:bg-gray-500 px-2 py-1 h-8 rounded'><MoreHorizontal size={16}></MoreHorizontal></button>
//                 </div>
//             </div>

//             <div className='flex flex-col w-full flex-grow relative'>
//                 <div className='absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden'>
//                     <DragDropContext onDragEnd={onDragEnd}>
//                         {bdata.list.map((x, ind) => (
//                             <div key={ind} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
//                                 <div className="list-body">
//                                     <div className='flex justify-between p-1'>
//                                         <span>{x.title}</span>
//                                         <button className='hover:bg-gray-500 p-1 rounded-sm'><MoreHorizontal size={16}></MoreHorizontal></button>
//                                     </div>
//                                     <Droppable droppableId={x.id}>
//                                         {(provided) => (
//                                             <div className='py-1' ref={provided.innerRef} {...provided.droppableProps}>
//                                                 {x.items.map((item, index) => (
//                                                     <Draggable key={item.id} draggableId={item.id} index={index}>
//                                                         {(provided) => (
//                                                             <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                                                                 <div className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
//                                                                     <span>{item.title}</span>
//                                                                     <button className='hover:bg-gray-600 p-1 rounded-sm' onClick={() => openPopup(item)}>
//                                                                         <Edit2 size={16}></Edit2>
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </Draggable>
//                                                 ))}
//                                                 {provided.placeholder}
//                                             </div>
//                                         )}
//                                     </Droppable>
//                                     <CardAdd getcard={() => { }}></CardAdd>
//                                 </div>
//                             </div>
//                         ))}
//                     </DragDropContext>
//                     <AddList getlist={() => { }}></AddList>
//                 </div>
//             </div>

//             {popupOpen && (
//                 <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-5 rounded-md w-96">
//                         <h3 className="text-2xl font-bold text-black">Edit Item</h3>
//                         <input className="border p-2 w-full mt-2 text-black" value={newName} onChange={(e) => setNewName(e.target.value)} />
//                         <h1 className="text-sm font-bold text-black">Description</h1>
//                         <textarea className="border p-2 w-full mt-2 text-black" placeholder="Add a description..." value={description} onChange={(e) => setDescription(e.target.value)} />
//                         <h1 className="text-sm font-bold text-black">Checklist</h1>
//                         <input className="border p-2 w-full mt-2 text-black" value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} placeholder="Checklist item" />
//                         <button className="bg-blue-500 text-white px-3 py-1 rounded mt-2" onClick={handleAddItemToChecklist}>Add</button>
//                         <div className="mt-2">
//                             {checklistItems.map((item, index) => (
//                                 <div key={index} className="flex items-center">
//                                     <input 
//                                         type="checkbox" 
//                                         checked={item.checked} 
//                                         onChange={() => handleToggleChecklistItem(index)} 
//                                     />
//                                     <span>{item.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="w-full mt-2">
//                             <div className="h-2 w-full bg-gray-200 rounded-full">
//                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${checklistProgress}%` }}></div>
//                             </div>
//                             <span>{checklistProgress}% Completed</span>
//                         </div>
//                         <div className="mt-3">
//                             <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded mr-2">Save</button>
//                             <button onClick={closePopup} className="bg-red-500 text-white py-2 px-4 rounded">Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Main;

import React, { useState, useContext } from 'react';
import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather';
import CardAdd from './CardAdd';
import { BoardContext } from '../context/BoardContext';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddList from './AddList';

const Main = () => {
    const { allboard, setAllBoard } = useContext(BoardContext);
    const bdata = allboard.boards[allboard.active];

    const [selectedItem, setSelectedItem] = useState(null);
    const [newName, setNewName] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);

    // State for checklist
    const [checklistTitle, setChecklistTitle] = useState('');
    const [checklistItems, setChecklistItems] = useState([]);
    const [checklistProgress, setChecklistProgress] = useState(0);

    function onDragEnd(res) {
        if (!res.destination) return;
        const newList = [...bdata.list];
        const s_id = parseInt(res.source.droppableId);
        const d_id = parseInt(res.destination.droppableId);
        const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
        newList[d_id - 1].items.splice(res.destination.index, 0, removed);

        let board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    }

    const openPopup = (item) => {
        setSelectedItem(item);
        setNewName(item.title);
        setDescription(item.description || '');
        setAttachments(item.attachments || []);
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
        setSelectedItem(null);
        setChecklistTitle('');
        setChecklistItems([]);
        setChecklistProgress(0);
        setShowChecklist(false);
    };

    const handleChecklistPopup = () => {
        setShowChecklist(true);
    };

    return (
        <div className='flex flex-col w-full' style={{ backgroundColor: `${bdata.bgcolor}` }}>
            <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>
                <h2 className='text-lg'>{bdata.name}</h2>
                <div className='flex items-center justify-center'>
                    <button className='bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center'>
                        <UserPlus size={16} className='mr-2'></UserPlus>
                        Share
                    </button>
                    <button className='hover:bg-gray-500 px-2 py-1 h-8 rounded'><MoreHorizontal size={16}></MoreHorizontal></button>
                </div>
            </div>

            <div className='flex flex-col w-full flex-grow relative'>
                <div className='absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden'>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {bdata.list.map((x, ind) => (
                            <div key={ind} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
                                <div className="list-body">
                                    <div className='flex justify-between p-1'>
                                        <span>{x.title}</span>
                                        <button className='hover:bg-gray-500 p-1 rounded-sm'><MoreHorizontal size={16}></MoreHorizontal></button>
                                    </div>
                                    <Droppable droppableId={x.id}>
                                        {(provided) => (
                                            <div className='py-1' ref={provided.innerRef} {...provided.droppableProps}>
                                                {x.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
                                                                    <span>{item.title}</span>
                                                                    <button className='hover:bg-gray-600 p-1 rounded-sm' onClick={() => openPopup(item)}>
                                                                        <Edit2 size={16}></Edit2>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    <CardAdd getcard={() => { }}></CardAdd>
                                </div>
                            </div>
                        ))}
                    </DragDropContext>
                    <AddList getlist={() => { }}></AddList>
                </div>
            </div>

            {popupOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-96">
                        <h3 className="text-2xl font-bold text-black">Edit Item</h3>
                        <input className="border p-2 w-full mt-2 text-black" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <h1 className="text-sm font-bold text-black">Description</h1>
                        <div className="mt-3">
                            <button onClick={handleChecklistPopup} className="bg-black text-white py-2 px-4 rounded">Checklist</button>
                            <button onClick={closePopup} className="bg-red-500 text-white py-2 px-4 rounded ml-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showChecklist && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-96">
                        <h3 className="text-2xl font-bold text-black">Checklist</h3>
                        <input className="border p-2 w-full mt-2 text-black" value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} placeholder="Checklist item" />
                        <button className="bg-blue-500 text-white px-3 py-1 rounded mt-2" onClick={() => setChecklistItems([...checklistItems, { name: checklistTitle, checked: false }])}>Add</button>
                        <div className="mt-2">
                            {checklistItems.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <input type="checkbox" checked={item.checked} onChange={() => { }} />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowChecklist(false)} className="bg-red-500 text-white py-2 px-4 rounded mt-2">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;
