import React, { useContext, useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, X, Edit, Trash } from 'react-feather';
import { Popover } from 'react-tiny-popover';
import { BoardContext } from '../context/BoardContext';

const Sidebar = () => {
    const blankBoard = {
        name: '',
        bgcolor: '#f60000',
        list: []
    };
    const [boardData, setBoarddata] = useState(blankBoard);
    const [collapsed, setCollapsed] = useState(false);
    const [showpop, setShowpop] = useState(false);
    const { allboard, setAllBoard } = useContext(BoardContext);

    // State untuk modal
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);

    // Set active board
    const setActiveboard = (i) => {
        let newBoard = { ...allboard };
        newBoard.active = i;
        setAllBoard(newBoard);
    };

    // Add new board
    const addBoard = () => {
        if (!boardData.name.trim()) return; // Prevent empty board names
        let newB = { ...allboard };
        newB.boards.push(boardData);
        setAllBoard(newB);
        setBoarddata(blankBoard);
        setShowpop(!showpop);
    };

    // Rename board
    const handleRename = () => {
        if (selectedBoardIndex !== null && boardData.name.trim() !== "") {
            const updatedBoards = [...allboard.boards];
            updatedBoards[selectedBoardIndex].name = boardData.name.trim();
            setAllBoard({
                ...allboard,
                boards: updatedBoards
            });
            setIsRenameModalOpen(false);
            setBoarddata(blankBoard); // Reset input field
        }
    };

    // Delete board
    const handleDelete = () => {
        if (selectedBoardIndex !== null) {
            const updatedBoards = allboard.boards.filter((_, i) => i !== selectedBoardIndex);
            setAllBoard({
                ...allboard,
                boards: updatedBoards,
                active: updatedBoards.length > 0 ? 0 : -1 // Reset active board to the first one or -1 if empty
            });
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className={`bg-[#121417] h-[calc(100vh-3rem)] border-r border-r-[#9fadbc29] transition-all linear duration-500 flex-shrink-0 ${collapsed ? 'w-[42px]' : 'w-[280px]'}`}>
            {/* Collapse Button */}
            {collapsed && (
                <div className='p-2'>
                    <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-slate-600 rounded-sm w-full text-center'>
                        <ChevronRight size={18}></ChevronRight>
                    </button>
                </div>
            )}
            {!collapsed && (
                <div>
                    <div className="workspace p-3 flex justify-between border-b border-b-[#9fadbc29]">
                        <h4>Workspace</h4>
                        <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-slate-600 rounded-sm p-1'>
                            <ChevronLeft size={18}></ChevronLeft>
                        </button>
                    </div>
                    <div className="boardlist">
                        <div className='flex justify-between px-3 py-2'>
                            <h6>Your Boards</h6>
                            <Popover
                                isOpen={showpop}
                                align='start'
                                positions={['right', 'top', 'bottom', 'left']}
                                content={
                                    <div className='ml-2 p-2 w-60 flex flex-col justify-center items-center bg-slate-600 text-white rounded'>
                                        <button onClick={() => setShowpop(!showpop)} className='absolute right-2 top-2 hover:bg-gray-500 p-1 rounded'>
                                            <X size={16}></X>
                                        </button>
                                        <h4 className='py-0'>Create Board</h4>
                                        {/* <img src="https://placehold.co/200x120/png" alt="" /> */}
                                        <div className="mt-3 flex flex-col items-start w-full">
                                            <label htmlFor="title">Board Title <span>*</span></label>
                                            <input
                                                value={boardData.name}
                                                onChange={(e) => setBoarddata({ ...boardData, name: e.target.value })}
                                                type="text"
                                                className='mb-2 h-8 px-2 w-full bg-gray-700'
                                            />
                                            <label htmlFor="Color">Board Color</label>
                                            <input
                                                value={boardData.bgcolor}
                                                onChange={(e) => setBoarddata({ ...boardData, bgcolor: e.target.value })}
                                                type="color"
                                                className='mb-2 h-8 px-2 w-full bg-gray-700'
                                            />
                                            <button onClick={addBoard} className='w-full rounded h-8 bg-slate-700 mt-2 hover:bg-gray-500'>
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                }
                            >
                                <button onClick={() => setShowpop(!showpop)} className='hover:bg-slate-600 p-1 rounded-sm'>
                                    <Plus size={16}></Plus>
                                </button>
                            </Popover>
                        </div>
                    </div>
                    <ul>
                        {allboard.boards.length > 0 ? (
                            allboard.boards.map((x, i) => {
                                return (
                                    <li key={i}>
                                        <button
                                            onClick={() => setActiveboard(i)}
                                            className='px-3 py-2 w-full text-sm flex justify-between items-center hover:bg-gray-500'
                                        >
                                            <div className='flex items-center'>
                                                <span className='w-6 h-max rounded-sm mr-2' style={{ backgroundColor: `${x.bgcolor}` }}>
                                                    &nbsp;
                                                </span>
                                                <span>{x.name}</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering setActiveboard
                                                        setSelectedBoardIndex(i);
                                                        setIsRenameModalOpen(true);
                                                    }}
                                                    className='hover:text-blue-500'
                                                >
                                                    <Edit size={16}></Edit>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering setActiveboard
                                                        setSelectedBoardIndex(i);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className='hover:text-red-500'
                                                >
                                                    <Trash size={16}></Trash>
                                                </button>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-gray-400">
                                No boards available. <br />
                                <button
                                    onClick={() => setShowpop(true)}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                                >
                                    Create New Board
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
            )}

            {/* Rename Modal */}
            {isRenameModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Rename Board</h3>
                        <input
                            value={boardData.name}
                            onChange={(e) => setBoarddata({ ...boardData, name: e.target.value })}
                            type="text"
                            placeholder="Enter new board name"
                            className="w-full p-2 mb-4 bg-gray-700 rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsRenameModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRename}
                                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Delete Board</h3>
                        <p className="mb-4">Are you sure you want to delete this board? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;