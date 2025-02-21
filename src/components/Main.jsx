import React, { useState, useContext } from 'react';
import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather';
import CardAdd from './CardAdd';
import { BoardContext } from '../context/BoardContext';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddList from './AddList';
import Utils from '../utils/Utils';

const Main = () => {
    const { allboard, setAllBoard } = useContext(BoardContext);
    const bdata = allboard.boards[allboard.active];

    const [selectedItem, setSelectedItem] = useState(null);
    const [newName, setNewName] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);

    // State for checklist
    const [checklistTitle, setChecklistTitle] = useState('');
    const [checklistItems, setChecklistItems] = useState([]);
    const [checklistProgress, setChecklistProgress] = useState(0);
    const [showChecklist, setShowChecklist] = useState(false); // New state for checklist visibility

    const [editListId, setEditListId] = useState(null);
    const [editListTitle, setEditListTitle] = useState('');
    const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);


    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkInput, setLinkInput] = useState('');

    function onDragEnd(res) {
        if(!res.destination){
            console.log("No Destination");
            return;
        }
        const newList = [...bdata.list];
        const s_id = parseInt(res.source.droppableId);
        const d_id = parseInt(res.destination.droppableId);
        const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
        newList[d_id - 1].items.splice(res.destination.index, 0, removed);

        let board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    }

    const cardData = (e,ind)=>{
        let newList = [...bdata.list];
        newList[ind].items.push({id:Utils.makeid(5),title:e});

        let board_ = {...allboard};
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    }

    const listData = (e)=>{
        let newList = [...bdata.list];
        newList.push(
            {id:newList.length + 1 + '',title:e,items:[]}
        );

        let board_ = {...allboard};
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
        // Reset checklist hanya saat menutup popup secara manual
        setChecklistTitle('');
        setChecklistItems([]);
        setChecklistProgress(0);
        setShowChecklist(false);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files).map(file => {
            return { 
                type: file.type.startsWith('image/') ? 'image' : 'file', 
                name: file.name, 
                url: URL.createObjectURL(file) 
            };
        });
        setAttachments([...attachments, ...files]);
    };

    const handleAddLink = () => {
        setLinkModalOpen(true);
    };
    
    const handleSaveLink = () => {
        if (linkInput.trim()) {
            setAttachments([...attachments, { type: 'link', name: linkInput }]);
            setLinkInput('');
            setLinkModalOpen(false);
        }
    };

    const handleSave = () => {
        let newList = [...bdata.list];
        newList.forEach(list => {
            list.items = list.items.map(item => {
                if (item.id === selectedItem.id) {
                    return { 
                        ...item, 
                        title: newName, 
                        description, 
                        attachments, 
                        checklist: { 
                            title: checklistTitle, 
                            items: checklistItems, 
                            progress: checklistProgress 
                        }
                    };
                }
                return item;
            });
        });
    
        let board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    
        // Jangan reset checklist state di sini
        // closePopup(); // Hapus ini
        setPopupOpen(false); // Hanya tutup popup tanpa mereset state
    };

    const handleDeleteAttachment = (index) => {
        const updatedAttachments = [...attachments];
        updatedAttachments.splice(index, 1);
        setAttachments(updatedAttachments);
    };

    const handleDeleteItemInPopup = () => {
        let newList = [...bdata.list];
        newList.forEach(list => {
            list.items = list.items.filter(item => item.id !== selectedItem.id);
        });

        let board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
        closePopup();
    };

    // Handle checklist functionality
    const handleAddItemToChecklist = () => {
        if (checklistTitle.trim() && checklistItems.length < 10) {
            setChecklistItems([...checklistItems, { name: checklistTitle, checked: false }]);
            setChecklistTitle('');
        }
    };

    const handleToggleChecklistItem = (index) => {
        const updatedItems = [...checklistItems];
        updatedItems[index].checked = !updatedItems[index].checked;
        setChecklistItems(updatedItems);

        // Recalculate progress
        const checkedItems = updatedItems.filter(item => item.checked).length;
        setChecklistProgress((checkedItems / updatedItems.length) * 100);
    };

    const handleDeleteChecklistItem = (index) => {
        const updatedItems = checklistItems.filter((_, i) => i !== index);
        setChecklistItems(updatedItems);
        
        // Update progress
        if (updatedItems.length > 0) {
            const checkedItems = updatedItems.filter(item => item.checked).length;
            setChecklistProgress((checkedItems / updatedItems.length) * 100);
        } else {
            setChecklistProgress(0);
        }
    };

    const openEditListModal = (list) => {
        setEditListId(list.id);
        setEditListTitle(list.title);
        setIsEditListModalOpen(true);
    };

    const handleSaveListTitle = () => {
        let newList = [...bdata.list].map(list =>
            list.id === editListId ? { ...list, title: editListTitle } : list
        );
    
        let board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    
        setIsEditListModalOpen(false);
    };

    const handleDeleteList = () => {
        let newList = bdata.list.filter(list => list.id !== editListId);
    
        let board_ = { ...allboard };
        board_.boards[board_.active].list = newList;
        setAllBoard(board_);
    
        setIsEditListModalOpen(false);
    };
    
    
    
    return (
<div className='flex flex-col w-full' style={{backgroundColor:`${bdata.bgcolor}`}}>
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
                {bdata.list && bdata.list.map((x, ind) => (
                    <div key={ind} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
                        <div className="list-body">
                            <div className='flex justify-between p-1'>
                                <span>{x.title}</span>
                                    <button 
                                        className='hover:bg-gray-500 p-1 rounded-sm' 
                                        onClick={() => openEditListModal(x)}
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                            </div>
                            <Droppable droppableId={x.id}>
                                {(provided, snapshot) => (
                                    <div className='py-1'
                                         ref={provided.innerRef}
                                         style={{ backgroundColor: snapshot.isDraggingOver ? '#222' : 'transparent' }}
                                         {...provided.droppableProps}>
                                        {x.items && x.items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <div className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
                                                            <span>{item.title}</span>
                                                            <span className='flex justify-start items-start'>
                                                                <button className='hover:bg-gray-600 p-1 rounded-sm' onClick={() => openPopup(item)}>
                                                                    <Edit2 size={16}></Edit2>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <CardAdd getcard={(e) => cardData(e, ind)}></CardAdd>
                        </div>
                    </div>
                ))}
            </DragDropContext>
            <AddList getlist={(e) => listData(e)}></AddList>
        </div>
    </div>

            {popupOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-96">
                        <h3 className="text-2xl font-bold text-black">Edit Item</h3>
                        <input className="border p-2 w-full mt-2 text-black" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <h1 className="text-sm font-bold text-black">Description</h1>
                        <textarea className="border p-2 w-full mt-2 text-black" placeholder="Add a description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                        <h1 className="text-sm font-bold text-black">Activities</h1>
                        <div className="mt-2">
                            <button className="text-white px-3 py-1 rounded mr-2 " onClick={handleAddLink} style={{ backgroundColor: '#808080' }}>Add Link</button>
                            <input type="file" multiple className="hidden" id="fileUpload" onChange={handleFileUpload} />
                            <label htmlFor="fileUpload" className="text-white px-3 py-1 rounded cursor-pointer" style={{ backgroundColor: '#808080' }}>Upload File</label>
                            <button 
                                className="text-white px-3 py-1 rounded mt-2 ml-2" 
                                onClick={() => setShowChecklist(!showChecklist)}
                                style={{ backgroundColor: '#808080' }}
                            >
                                {showChecklist > 0 ? 'Hide Checklist' : 'Show Checklist'}
                            </button>
                        </div>

                        <ul className="mt-2">
                            {attachments.map((att, index) => (
                                <li key={index} className="text-sm flex items-center justify-between">
                                    <a 
                                        href={att.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center"
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            window.open(att.url, "_blank", "noopener,noreferrer");
                                        }}
                                    >
                                        {att.type === 'image' ? (
                                            <img src={att.url} alt={att.name} className="w-16 h-16 object-cover mr-2 cursor-pointer rounded ml-2 mt-2" />
                                        ) : att.type === 'link' ? (
                                            <span className="text-2x2 mr-3 rounded ml-2 mt-1">🔗</span> 
                                        ) : (
                                            <span className="text-2x2 mr-3 rounded ml-2 mt-1">📄</span>  
                                        )}
                                        <span className="text-blue-500 underline cursor-pointer">{att.name}</span>
                                    </a>
                                    <button 
                                        className="bg-red-800 text-white px-2 py-1 rounded ml-2 mt-2" 
                                        onClick={() => handleDeleteAttachment(index)}
                                    >
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>




                        {showChecklist || checklistItems.length > 0 ? (
                        <>
                            <h1 className="text-sm font-bold text-black">Checklist</h1>
                            <input className="border p-2 w-full mt-2 text-black" value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} placeholder="Checklist item" />
                            <button className="text-white px-3 py-1 rounded mt-2" onClick={handleAddItemToChecklist} style={{ backgroundColor: '#808080' }}>Add</button>
                            <div className="w-full mt-2">
                                <div className="h-2 w-full bg-gray-200 rounded-full">
                                    <div className="bg-green-800 h-full rounded-full" style={{ width: `${checklistProgress}%` }}></div>
                                </div>
                                <span>{checklistProgress}% Completed</span>
                            </div>
                            <div className="mt-2">
                                {checklistItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={item.checked} 
                                                onChange={() => handleToggleChecklistItem(index)} 
                                                className="accent-[#006699]" 
                                            />
                                            <span className={item.checked ? "line-through" : ""}>{item.name}</span>
                                        </div>
                                        <button 
                                            className="bg-red-800 text-white px-2 py-1 rounded ml-2 rounded mt-1 ml-1" 
                                            onClick={() => handleDeleteChecklistItem(index)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}

                        <div className="mt-3">
                        <button className="bg-green-800 text-white px-3 py-1 rounded mt-2" onClick={handleSave}>Save</button>
                        <button className="bg-black text-white px-3 py-1 rounded mt-2 ml-2" onClick={closePopup}>Close</button>
                        <button className="bg-red-800 text-white px-3 py-1 rounded mt-2 ml-2" onClick={handleDeleteItemInPopup}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {linkModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-96">
                        <h3 className="text-2xl font-bold text-black mb-3">Add Attachment Link</h3>
                        <input 
                            type="text" 
                            className="border p-2 w-full text-black rounded-md" 
                            placeholder="Enter link..." 
                            value={linkInput} 
                            onChange={(e) => setLinkInput(e.target.value)} 
                        />
                        <div className="mt-3 flex justify-end">
                            <button 
                                className="bg-red-800 text-white px-3 py-1 rounded mr-2" 
                                onClick={() => setLinkModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-green-800 text-white px-3 py-1 rounded" 
                                onClick={handleSaveLink}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        {isEditListModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-5 rounded-md w-96">
                    <h3 className="text-2xl font-bold text-black mb-3">Edit List Title</h3>
                    <input 
                        type="text" 
                        className="border p-2 w-full text-black rounded-md" 
                        value={editListTitle} 
                        onChange={(e) => setEditListTitle(e.target.value)} 
                    />
                    <div className="mt-3 flex justify-end">
                        <button 
                            className="bg-red-800 text-white px-3 py-1 rounded mr-2" 
                            onClick={handleDeleteList}
                        >
                            Delete
                        </button>
                        <button 
                            className="bg-green-800 text-white px-3 py-1 rounded" 
                            onClick={handleSaveListTitle}
                        >
                            Save
                        </button>
                        <button 
                            className="bg-gray-600 text-white px-3 py-1 rounded ml-2" 
                            onClick={() => setIsEditListModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}

        </div>
    );
};

export default Main;