import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../../redux/templateThunks.js';

import { deleteTemplate } from '../../redux/templateThunks.js';
import Skeleton from '@mui/material/Skeleton';








function Templates() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchTemplates());
    }, []);

    const handleDelete = (e, template) => {
        e.stopPropagation();
        dispatch(deleteTemplate(template))

    }

    const handleTemplateAdd = () => {
        navigate("/manageTemplates", { state: { openForm: true } });
    }


    const { templates, loading } = useSelector((state) => state.templates);
    console.log(templates);



    return (
        <>


            <div>
                <div className='flex px-4 mt-2 items-center justify-between'>
                    <form action="" className=''>
                        <div className='search-bar w-full flex items-center max-w-[500px]  relative'>

                            <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                            <input type="text" className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[10px] focus:outline-none !font-medium' placeholder='Search here ... '
                            />

                        </div>
                    </form>


                    <button type='button ' className='bg-green-600 cursor-pointer text-white  px-4 py-2 rounded-md hover:bg-green-700 transition duration-200' onClick={handleTemplateAdd}>
                        Add
                    </button>
                </div>
            </div>



            <div className='mt-6 px-4'>

                <div className='p-4 bg-white rounded-lg min-h-[70vh] overflow-auto text-gray-600'>

                    <table className='table-auto w-full'>

                        <thead className="text-md">
                            <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                                <th className="px-[10px] pb-4 text-left">Name</th>
                                <th className="px-[10px] pb-4">Category</th>
                                <th className="px-[10px] pb-4">Language</th>
                                <th className="px-[10px] pb-4">Status</th>
                                <th className="px-[10px] pb-4 ">Last Edited</th>
                                <th className="px-[10px] pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>


                            {loading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-[10px] py-4 text-left">
                                            <Skeleton variant="text" animation="wave" width="100%" height={20} />
                                        </td>
                                        <td className="px-[10px]  py-4 text-center">
                                            <Skeleton variant="text" animation="wave" width="50%" className='mx-auto' height={20} />
                                        </td>
                                        <td className="px-[10px] py-4 text-center">
                                            <Skeleton variant="text" animation="wave" width="50%" className='mx-auto' height={20} />
                                        </td>
                                        <td className="px-[10px] py-4 text-center">
                                            <Skeleton variant="rectangular" animation="wave" width="50%" className='mx-auto' height={20} />
                                        </td>
                                        <td className="px-[10px] py-4 text-center">
                                            <Skeleton variant="text" animation="wave" width="30%" className='mx-auto' height={20} />
                                        </td>

                                        <td className="px-[10px] py-4 text-right">
                                            <Skeleton variant="text" animation="wave" width="30%" className='float-right' height={20} />
                                        </td>
                                    </tr>
                                ))
                            ):


                            
                            (templates.map((template) => (
                                <tr key={template.id} className="text-center hover:bg-green-50 font-semibold cursor-pointer text-sm">
                                    <td className="px-[10px] py-4 text-left text-blue-600">{template.name}</td>
                                    <td className="px-[10px]  py-4 text-center">{template.category}</td>
                                    <td className="px-[10px] py-4 text-center">{template.language}</td>
                                    <td className="px-[10px] py-4 text-center"> <span
                                        className={`rounded-2xl py-1 text-white text-center w-[95px] inline-block
                                                ${template.status === 'APPROVED'
                                                ? 'bg-green-100 !text-green-700'
                                                : template.status === 'PENDING'
                                                    ? 'bg-orange-100 !text-orange-500'
                                                    : 'bg-red-100 !text-red-700'
                                            }`}
                                    >
                                        {template.status}
                                    </span></td>
                                    <td className="px-[10px] py-3 text-gray-400 italic ">

                                        {template.createdAt
                                            ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                                                new Date(template.createdAt)
                                            )
                                            : 'N/A'}

                                    </td>
                                    <td className="px-[10px] py-4 text-right">
                                        <button className='text-blue-500 hover:text-blue-700'>Edit</button>
                                        <i
                                            className="fa-solid fa-trash text-red-400 bg-white ml-2 p-2 rounded-full text-lg cursor-pointer hover:scale-105"
                                            onClick={(e) => handleDelete(e, template)}
                                        />
                                    </td>
                                </tr>
                            )))}
                        </tbody>

                    </table>

                </div>

            </div>


        </>
    )
}

export default Templates