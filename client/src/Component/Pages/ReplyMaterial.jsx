import React, { useState } from 'react';
import SideBar from '../ReplyMaterial/Sidebar';

function ReplyMaterial() {
  const [selected, setSelected]  = useState('Text');

  console.log(selected);


  return (
    <>
      <div className=' m-4 bg-gray-50 rounded-lg flex'>


        <SideBar selected={setSelected} />


        <div className='p-4 flex-grow'>

          <div className='flex items-center justify-between'>
            <form action="" className=''>
              <div className='search-bar w-full flex items-center max-w-[500px]  relative'>

                <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                <input type="text" className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[10px] focus:outline-none !font-medium' placeholder='Search here ... '
                />

              </div>
            </form>


            <button type='button ' className='bg-green-600 cursor-pointer text-white  px-4 py-2 rounded-md hover:bg-green-700 transition duration-200'>
              Add
            </button>
          </div>



          <div>


          </div>

        </div>

      </div>
    </>
  )
}

export default ReplyMaterial