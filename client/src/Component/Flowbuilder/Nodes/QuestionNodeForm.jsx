import React, { useEffect, useRef } from 'react'
import { Button, TextField } from '@mui/material';





function QuestionNodeForm({ onClose, node }) {

    console.log(node);


    const handleAddButton = () => {
        console.log('Add button clicked');

    }


    const formRef = useRef(null);

    const handleClickOutside = (event) => {

        if (formRef.current && !formRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (
        <>
            <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>

                <div ref={formRef} className='p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[350px] relative z-50'>

                    <div className='flex justify-between items-center  pb-4'>
                        <h4 className='font-semibold text-lg'>Set a question</h4>
                        <i
                            className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                            onClick={onClose}
                        ></i>
                    </div>


                    <div>

                        <TextField
                            required
                            name="questionContent"
                            label="Question Content"

                            multiline
                            rows={5}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                                mt: 2,
                                backgroundColor: '#f9fafb',
                                borderRadius: '4px',
                                '& label.Mui-focused': {
                                    color: '#00A63E',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#00A63E',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#00A63E',
                                    },
                                    borderRadius: '10px',
                                },
                            }}
                        />

                    </div>


                    <div>
                        <Button
                            variant="outlined"
                            component="label"
                            size="small"
                            className='!border-green-600 !text-green-600 !mt-4 float-right'
                            onClick={handleAddButton}
                        >
                            Add button

                        </Button>
                    </div>

                </div>

            </div>
        </>
    )
}

export default QuestionNodeForm