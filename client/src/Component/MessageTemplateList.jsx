import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, deleteTemplate } from '../redux/templateThunks.js';
import { toast } from 'react-toastify';

function MessageTemplateList({ onSuccess, onSelectTemplateId, selectedTemplateId }) {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.templates);

  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit, searchTerm]);

  const languageMap = {
    en: 'English',
    en_US: 'English (US)',
    hi: 'Hindi',
  };

  const filteredTemplates = [...templates].reverse().filter((template) => {
    const search = searchTerm.toLowerCase();
    return (
      template.name?.toLowerCase().includes(search) ||
      template.category?.toLowerCase().includes(search) ||
      template.status?.toLowerCase().includes(search) ||
      languageMap[template.language]?.toLowerCase().includes(search) ||
      template.id?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredTemplates.length / limit);
  const currentData = filteredTemplates.slice((currentPage - 1) * limit, currentPage * limit);

  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  const handleDelete = (e, template) => {
    e.stopPropagation();
    dispatch(deleteTemplate(template));
  };

  const handleEdit = (e, template) => {
    e.stopPropagation();
    onSuccess(template);
  };






  return (
    <div className="mt-[20px] rounded-md min-h-[82vh] flex flex-col justify-between">
      {loading ? (
        <div className="py-10 text-center text-gray-500 text-lg">Loading templates...</div>
      ) : (
        <>
          <div>
            <div className="pb-2">
              <input
                type="text"
                placeholder="Search by name, category, status, ID, or language..."
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-auto max-h-[70vh]">
              <table className="table-auto w-full">
                <thead>
                  <tr className="sticky top-0 z-10 bg-blue-600 text-white text-center text-nowrap">
                    <th className="px-4 py-4 text-left">Template Id</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Language</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Last Edited</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((template) => (
                    <tr
                      key={template.id}
                      onClick={() => onSelectTemplateId?.(template.id)}
                      className={`group text-nowrap text-center border-b border-gray-200 hover:bg-blue-100 font-semibold cursor-pointer text-sm ${selectedTemplateId === template.id ? 'bg-blue-100' : ''
                        }`}
                    >
                      <td className="px-4 py-3 text-left">{template.id}</td>
                      <td className="px-4 py-3">{template.name}</td>
                      <td className="px-4 py-3">{template.category}</td>
                      <td className="px-4 py-3">{languageMap[template.language] || template.language}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-2xl px-2 py-1 text-white text-center  
                            ${template.status === 'APPROVED'
                              ? 'bg-green-100 !text-green-700'
                              : template.status === 'PENDING'
                                ? 'bg-orange-100 !text-orange-500'
                                : 'bg-red-100 !text-red-700'
                            }`}
                        >
                          {template.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 italic relative">
                        <span className={`group-hover:hidden ${selectedTemplateId === template.id ? 'hidden' : 'text-nowrap'}`}>
                          {template.createdAt
                            ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(template.createdAt))
                            : 'N/A'}
                        </span>
                        <div className={`absolute top-1/2 left-0 right-0 transform -translate-y-1/2 gap-6 justify-center items-center ${selectedTemplateId === template.id ? 'flex' : 'hidden group-hover:flex'}`}>
                          <i className="fa-solid fa-pen-to-square text-blue-500 bg-white p-2 rounded-full text-lg cursor-pointer hover:scale-105"
                            onClick={(e) => handleEdit(e, template)} />
                          <i className="fa-solid fa-trash text-red-400 bg-white p-2 rounded-full text-lg cursor-pointer hover:scale-105"
                            onClick={(e) => handleDelete(e, template)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-1 px-4 py-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border px-2 py-1 rounded">
                {[2, 3, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={handlePrev} disabled={currentPage === 1}><i className={`fas fa-angle-left ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600'}`} /></button>
              <button onClick={handleNext} disabled={currentPage === totalPages}><i className={`fas fa-angle-right ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-600'}`} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MessageTemplateList;
