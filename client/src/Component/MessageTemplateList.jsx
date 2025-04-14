import React, { useEffect, useState } from 'react';
import axios from 'axios';






const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;

function MessageTemplateList({ onSuccess }) {
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const languageMap = {
    en: 'English',
    hi: 'Hindi'
  };



  const handleDeleteTemplate = (template) => {
    const existing = JSON.parse(localStorage.getItem('whatsappTemplates') || '[]');
    const updated = existing.map((e) =>
      e.id === template.id ? { ...e, deleted: true } : e
    );
    localStorage.setItem('whatsappTemplates', JSON.stringify(updated));
    setTemplateList(updated.filter((t) => !t.deleted)); // hide deleted in UI
    toast.success('Template Deleted Successfully!');
  };



  const handleEditTemplate = (template) => {
    onSuccess(template);

  }

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        access_token: accessToken,
        limit: '1000',
      });

      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${businessId}/message_templates?${queryParams}`
      );

      const apiTemplates = response.data.data;
      const existing = JSON.parse(localStorage.getItem('whatsappTemplates') || '[]');

      const updated = existing.map((e) => {
        const latest = apiTemplates.find((t) => t.id === e.id);
        return latest ? { ...e, ...latest } : e;
      });

      const onlyNew = apiTemplates.filter((t) => !existing.some((e) => e.id === t.id));
      const finalTemplates = [...updated, ...onlyNew];


      const visibleTemplates = finalTemplates.filter((t) => !t.deleted);

      localStorage.setItem('whatsappTemplates', JSON.stringify(finalTemplates));
      setTemplateList(visibleTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchTemplates();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);



  const totalPages = Math.ceil(templateList.length / limit);
  const currentData = templateList.slice((currentPage - 1) * limit, currentPage * limit);






  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="mt-[20px] rounded-md bg-white">
      {loading ? (
        <div className="py-10 text-center text-gray-500 text-lg">Loading templates...</div>
      ) : (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-blue-600  text-white">
                <th className="px-4 py-4 text-left">Template Id</th>
                <th className="px-4 py-4 text-left">Template Name</th>
                <th className="px-4 py-4 text-left">Category</th>
                <th className="px-4 py-4 text-left">Language</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Last Edited</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((template, index) => (

                <tr
                  key={template.id || index}
                  className="group border-b border-gray-200 hover:bg-gray-50 text-md font-semibold cursor-pointer text-sm"
                >
                  <td className="px-4 py-3">{template.id}</td>
                  <td className="px-4 py-3">{template.name}</td>
                  <td className="px-4 py-3">{template.category}</td>
                  <td className="px-4 py-3">{languageMap[template.language] || template.language}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-2xl p-1 text-white text-center  
                               ${template.status.toLowerCase() === 'approved' ? 'bg-green-500' :
                          template.status === 'pending' ? 'bg-orange-400' :
                            template.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'}`}
                    >
                      {template.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-400 italic relative">

                    <span className="group-hover:hidden text-nowrap">
                      {template.createdAt
                        ? new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                        }).format(new Date(template.createdAt))
                        : 'N/A'}
                    </span>

                    <div className="hidden group-hover:flex gap-6 justify-start items-center ">
                      <i className="fa-solid text-blue-500 fa-pen-to-square hover:text-blue-600 cursor-pointer text-lg" onClick={() => handleEditTemplate(template)}></i>
                      <i className="fa-solid text-red-400 fa-trash hover:text-red-500 cursor-pointer text-lg" onClick={() => handleDeleteTemplate(template)}></i>
                    </div>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>



          {/* Pagination Footer */}
          <div className="flex items-center justify-between mt-4 px-4 py-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-1"
              >
                <i
                  className={`fas text-xl fa-angle-left ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600'
                    }`}
                />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-1"
              >
                <i
                  className={`fas text-xl fa-angle-right ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-600'
                    }`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MessageTemplateList;
