import React, { useState } from 'react';
import SideBar from '../ReplyMaterial/Sidebar';
import TextReplyMaterial from '../ReplyMaterial/TextReplyMaterial';






function ReplyMaterial() {
  const [selected, setSelected] = useState('Text');

  console.log(selected);


  


  return (
    <>
      <div className=' m-4 bg-gray-100 rounded-lg flex min-h-[80vh]'>


        <SideBar selected={setSelected} />


        <div className='p-4 flex-grow'>

          {selected === 'Text' && <TextReplyMaterial />}
          

        </div>

      </div>
    </>
  )
}

export default ReplyMaterial