import React, { useState } from 'react';
import MessageTemplateList from '../MessageTemplateList.jsx';
import CreateTemplarte from '../CreateTemplarte.jsx';




function ManageTemplates() {


  const [isOpen, setIsOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);


  const handleFormModel = () => {
    setIsOpen(!isOpen);

    if (isOpen) {
      setEditingTemplate(null);
    }

  }
  const handleEdit = (template) => {
    setEditingTemplate(template); 
    console.log(template);
    setIsOpen(true); 
  };


  return (
    <div className='bg-gray-100 px-[15px] py-[10px] '>
      <div className='flex justify-between gap-[20px] items-stretch'>



        <div className='bg-white p-[15px] rounded-md flex-[66%]'>


          <div className='flex justify-between items-center '>
            <h2 className='font-bold text-xl'>Message Template</h2>

            { !isOpen && <button type='button' className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-[5px] px-[12px] rounded' on onClick={handleFormModel}>Create Template</button> }


            { isOpen && <button type='button' className='bg-red-500 hover:bg-red-600 cursor-pointer text-white font-semibold py-[5px] px-[12px] rounded' onClick={handleFormModel}>Close</button> }

          </div>


          {isOpen && <CreateTemplarte  templateData={editingTemplate} onSuccess={() => setIsOpen(false)}/>}



          {!isOpen && <MessageTemplateList onSuccess={handleEdit}/>}


        </div>


        <div className='bg-white p-[15px] rounded-md flex-[33%]'>
          <h2 className='font-bold text-xl'>Your Template</h2>
          <p className='font-semibold text-md mt-[5px] text-gray-600'>
            Here you can see the selected message content body
          </p>
        </div>
      </div>




    </div>
  );
}

export default ManageTemplates;
