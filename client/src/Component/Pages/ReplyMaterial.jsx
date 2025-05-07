import React, { useState } from 'react';
import SideBar from '../ReplyMaterial/Sidebar';
import TextReplyMaterial from '../ReplyMaterial/TextReplyMaterial';
import Templates from '../ReplyMaterial/Templates';






function ReplyMaterial({ onClose, Keywords}) {
  const [selected, setSelected] = useState('Text');

 

  


  return (
    <>
      <div className=' m-4 mt-14 bg-gray-100 rounded-lg flex min-h-[80vh] max-h-[80vh] '>


        <SideBar selected={setSelected} />


        <div className=' flex-grow'>

          {selected === 'Text' && <TextReplyMaterial onClose={onClose} Keywords={Keywords} />}

          {selected === 'Templates' && <Templates onClose={onClose} Keywords={Keywords} />}
          

        </div>

      </div>
    </>
  )
}

export default ReplyMaterial