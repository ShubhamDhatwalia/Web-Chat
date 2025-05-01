import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addKeyword, removeKeyword, editKeyword } from "../redux/Keywords/keywordSlice";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Slider from '@mui/material/Slider';
import { toast } from 'react-toastify';





function CreateKeyword({ onClose, editData }) {
    const steps = ['Trigger Keyword', 'Reply Action'];
    const [popUp, setPopUp] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');
    const modalRef = useRef(null);

    const [keywordConfig, setKeywordConfigState] = useState({
        keywords: [],
        matchingMethod: "fuzzy",
        fuzzyThreshold: 70,
        replyMaterial: 'Sample Reply',
    });
    const [activeStep, setActiveStep] = useState(0);


    const dispatch = useDispatch();




    const handleEdit = () => {
        dispatch(editKeyword({ oldKeyword: editData, newKeyword: keywordConfig }));
        setActiveStep(prev => prev + 1);
        onClose();
        toast.success("Keyword edited successfully!");

    };

    useEffect(() => {
        if (editData) {
            setKeywordConfigState(editData);
        }
    }, [editData]);


    const handleKeyword = () => {
        const trimmed = newKeyword.trim();
        if (!trimmed) return;

        setKeywordConfigState(prev => ({
            ...prev,
            keywords: [...prev.keywords, trimmed]
        }));


        setNewKeyword('');
        setPopUp(false);
    };

    const handleDelete = (kw) => {
        setKeywordConfigState(prev => ({
            ...prev,
            keywords: prev.keywords.filter(k => k !== kw)
        }));

        dispatch(removeKeyword(kw));


    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setPopUp(false);
            }
        };

        if (popUp) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popUp]);

    const handleSubmit = () => {
        console.log("Final Config:", keywordConfig);
        dispatch(addKeyword(keywordConfig));
        setActiveStep(prev => prev + 1);
        toast.success("Keyword added successfully!");

    };

    const handleClose = () => {
        setPopUp(false);
        setNewKeyword('');
    }




    return (
        <>
            <div className='p-8'>
                <div
                    className='inline-block p-2 hover:bg-gray-100 rounded-lg font-semibold cursor-pointer'
                    onClick={onClose}
                >
                    <i className='fa-solid fa-arrow-left mr-2'></i>
                    <span>Back</span>
                </div>

                <div className='mt-8'>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{
                            minHeight: 100,
                            '& .MuiStepConnector-line': {
                                borderColor: '#E17100',
                                borderTopWidth: 3,
                                width: '99%',
                                borderStyle: 'dashed'
                            },
                            '& .MuiStepConnector-root': {
                                top: '30px',

                            },
                            '&.MuiStepConnector-root': {
                                left: 'calc(-50 % + 22px) !important',
                                right: 'calc(50 % + 22px) !important',
                            },
                            '& .MuiStepLabel-root .Mui-active': {
                                color: '#E17100',
                                fontWeight: '700',
                            },
                            '& .MuiStepLabel-root .Mui-completed': {
                                color: '#E17100',
                                fontWeight: '700',
                            },
                            '& .MuiStepLabel-label': {
                                fontWeight: '700',
                                fontSize: '18px',
                            },
                            '& .MuiStepIcon-root.Mui-active': {
                                color: '#E17100',
                            },
                            '& .MuiStepIcon-root.Mui-completed': {
                                color: '#E17100',
                            },
                            '& .MuiStepIcon-root': {
                                fontSize: '58px',
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>

                <div className='mt-18 bg-gray-100 p-8 rounded-lg'>
                    <div className='flex flex-wrap gap-6 items-center'>
                        <h4 className='font-semibold'>Keyword(s):</h4>

                        <ul className='text-gray-700 flex flex-wrap gap-6 items-center'>
                            {keywordConfig.keywords.map((kw, index) => (
                                <li key={index} className='flex bg-white py-[9px] max-w-[200px] px-1 pl-3 rounded-lg justify-between items-center'>
                                    <span className='truncate'>{kw}</span>
                                    <i
                                        className="fa-solid fa-xmark ml-2 text-lg text-red-600 bg-red-100 cursor-pointer hover:scale-105 rounded-full px-1 py-[2px]"
                                        onClick={() => handleDelete(kw)}
                                    ></i>
                                </li>
                            ))}
                        </ul>

                        <button
                            type='button'
                            onClick={() => setPopUp(true)}
                            className='border-dashed border-1 text-nowrap py-2 hover:bg-green-50 cursor-pointer px-2 rounded-md font-semibold border-green-600 text-green-600'
                        >
                            Add Keyword +
                        </button>
                    </div>

                    <div className='mt-18 flex gap-8'>
                        <h4 className='font-semibold'>Message matching methods:</h4>
                        <div className="flex gap-8 font-semibold text-gray-700">
                            {['fuzzy', 'exact', 'contains'].map(method => (
                                <label key={method}>
                                    <input
                                        type="radio"
                                        name="matchingMethod"
                                        className="mr-2 accent-orange-600"
                                        value={method}
                                        checked={keywordConfig.matchingMethod === method}
                                        onChange={(e) =>
                                            setKeywordConfigState(prev => ({
                                                ...prev,
                                                matchingMethod: e.target.value
                                            }))
                                        }
                                    />
                                    {method.charAt(0).toUpperCase() + method.slice(1)} matching
                                </label>
                            ))}
                        </div>
                    </div>

                    {keywordConfig.matchingMethod === "fuzzy" && (
                        <div className="mt-22">
                            <Slider
                                value={keywordConfig.fuzzyThreshold}
                                onChange={(e, newValue) =>
                                    setKeywordConfigState(prev => ({
                                        ...prev,
                                        fuzzyThreshold: newValue
                                    }))
                                }
                                min={0}
                                max={100}
                                step={1}
                                valueLabelDisplay="on"
                                valueLabelFormat={(value) => `${value}%`}
                                sx={{
                                    width: '50%',
                                    height: '10px',
                                    color: '#E17100',
                                    '& .MuiSlider-valueLabel': {
                                        backgroundColor: '#f9dfc5',
                                        color: '#E17100',
                                        border: '1px solid #E17100',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        '&::before': {

                                            borderRight: '1px solid #E17100',

                                            borderBottom: '1px solid #E17100',

                                        },
                                    },
                                    '& .MuiSlider-thumb': {
                                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                            boxShadow: '0px 0px 0px 8px rgba(225, 113, 0, 0.16)',
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}

                    <div className='mt-14 flex gap-8'>
                        <button
                            type='button'
                            className='bg-green-600 cursor-pointer hover:bg-green-700 text-white py-2 rounded-md px-2'
                            onClick={handleSubmit}
                        >
                            Next Step
                        </button>


                        <button
                            type="button"
                            onClick={handleEdit}
                            className={`text-white py-2 px-2 rounded-md ${!editData || JSON.stringify(editData) === JSON.stringify(keywordConfig)
                                ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                                : 'bg-green-600 hover:bg-green-700 cursor-pointer pointer-events-auto'
                                }
                            `}
                        >
                            Save Changes
                        </button>

                    </div>
                </div>
            </div>

            {popUp && (
                <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>
                    <div
                        ref={modalRef}
                        className='p-6 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[300px] relative z-50'
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleKeyword();
                            }}
                        >
                            <div className='flex justify-between items-center border-b border-gray-300 pb-4'>
                                <h4 className='font-semibold'>Add Keyword</h4>
                                <i
                                    className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                                    onClick={handleClose}
                                ></i>
                            </div>

                            <input
                                type='text'
                                required
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                className='w-full bg-gray-100 px-4 py-2 mt-6 rounded-md focus:outline-none text-sm'
                                placeholder='Please input a keyword'
                            />

                            <button
                                type='submit'
                                className='bg-green-600 hover:bg-green-700 rounded-lg px-2 py-2 text-white mt-6 float-right'
                            >
                                Add Keyword
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
}

export default CreateKeyword;
