import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { removeKeyword } from '../redux/Keywords/keywordSlice';


function KeywordsList({onOpen}) {
    const keywords = useSelector(state => state.keyword.keywords);
    const dispatch = useDispatch();



    const handleEdit = (index)=>{
        onOpen();

    }

    const handleDelete = (index) => {
        dispatch(removeKeyword(index));
    };

    console.log(keywords, 'keywords from redux store');

    return (
        <div className='flex flex-col justify-between min-h-[80vh]'>
            <div className='mt-0 px-6'>
                <table className='table-auto w-full'>
                    <thead className='text-xl '>
                        <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap ">
                            <th className="py-10 text-left font-semibold">Keyword</th>
                            <th className='py-10 text-center font-semibold'>Triggered</th>
                            <th className='py-10 text-center font-semibold'>Matching method</th>
                            <th className='py-10 text-center font-semibold'>Reply material</th>
                            <th className='py-10 text-right font-semibold'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {keywords.length > 0 ? (
                            keywords.map((kw, index) => (
                                <tr key={index} className=' text-center text-lg'>
                                    <td className='py-6 text-left'>
                                        {Array.isArray(kw.keywords) && kw.keywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {kw.keywords.map((word, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block bg-amber-100 text-amber-600 text-sm font-medium px-3 py-1 rounded-full"
                                                    >
                                                        {word}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>

                                    <td className='py-6'>{kw.triggered || 0}</td>
                                    <td className='py-6'>{kw.matchingMethod || 'Exact'}</td>
                                    <td className='py-6'>{kw.replyMaterial || 'None'}</td>
                                    <td className='py-6 text-right'>
                                        <div className='flex gap-4 justify-end'>
                                            <i className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg hover:text-blue-600 hover:bg-blue-100 cursor-pointer" onClick={()=> handleEdit(index)} ></i>
                                            <i className="fa-solid fa-trash bg-gray-100 p-2 rounded-lg hover:text-red-600 hover:bg-red-100 cursor-pointer" onClick={() => handleDelete(index)}></i>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className='py-10 text-center text-gray-500'>
                                    No keywords found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className='flex items-center justify-between px-8 py-9 text-sm bg-gray-100'>
                <div className='flex items-center text-lg font-semibold text-gray-600 gap-2'>
                    <span>Items per page:</span>
                    <select className='border border-gray-300 rounded px-2 py-1'>
                        <option>10</option>
                        <option selected>15</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>

                <div className='flex items-center text-lg font-semibold text-gray-600 gap-2'>
                    <span>{keywords.length} of {keywords.length}</span>
                    <button className='p-1' disabled>
                        <i className='fas fa-angle-double-left text-gray-400' />
                    </button>
                    <button className='p-1' disabled>
                        <i className='fas fa-angle-left text-gray-400' />
                    </button>
                    <button className='p-1'>
                        <i className='fas fa-angle-right text-gray-600' />
                    </button>
                    <button className='p-1'>
                        <i className='fas fa-angle-double-right text-gray-600' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KeywordsList;
