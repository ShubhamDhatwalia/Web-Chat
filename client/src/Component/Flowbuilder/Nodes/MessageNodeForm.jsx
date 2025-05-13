import React from 'react'

function MessageNodeForm({ onClose, node }) {
    return (
        <>
            <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>

                <div className='p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px] relative z-50'>

                    <div className='flex justify-between items-center border-b border-gray-300 pb-4'>
                        <h4 className='font-semibold'>Set a message</h4>
                        <i
                            className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                            onClick={onClose}
                        ></i>
                    </div>

                </div>

            </div>
        </>
    )
}

export default MessageNodeForm