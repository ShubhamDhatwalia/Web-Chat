import React, { useEffect, useRef, useState } from 'react';

function FilePreview({ files, setFiles }) {
    const [previewFiles, setPreviewFiles] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fileInputRef = useRef(null);







    useEffect(() => {
        const previews = [];

        if (files.length === 0) {
            setPreviewFiles([]);
            setSelectedIndex(0);
            return;
        }

        let loaded = 0;

        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                previews[index] = {
                    name: file.name,
                    url: reader.result,
                    type: file.type,
                    caption: ''
                };
                loaded++;
                if (loaded === files.length) {
                    setPreviewFiles(previews);
                }
            };

            if (
                file.type.startsWith('image/') ||
                file.type.startsWith('video/') ||
                file.type.startsWith('audio/') ||
                file.type === 'application/pdf' ||
                file.type.startsWith('text/')
            ) {
                reader.readAsDataURL(file);
            } else {
                previews[index] = {
                    name: file.name,
                    url: null,
                    type: file.type,
                    caption: ''
                };
                loaded++;
                if (loaded === files.length) {
                    setPreviewFiles(previews);
                }
            }
        });
    }, [files]);

    const getFileType = (type, name) => {
        if (type?.startsWith('image/')) return 'image';
        if (type?.startsWith('video/')) return 'video';
        if (type?.startsWith('audio/')) return 'audio';
        if (type === 'application/pdf') return 'pdf';
        if (type?.startsWith('text/')) return 'text';

        if (name && name.includes('.')) {
            const ext = name.split('.').pop().toLowerCase();
            if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return 'office';
        }

        return 'unknown';
    };

    const handleClose = () => {
        setFiles([]);
        setPreviewFiles([]);
        setSelectedIndex(0);
    };

    const handleCaptionChange = (e) => {
        const updatedPreviews = [...previewFiles];
        updatedPreviews[selectedIndex] = {
            ...updatedPreviews[selectedIndex],
            caption: e.target.value
        };
        setPreviewFiles(updatedPreviews);
    };

    const handleAddMoreClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAddMoreFiles = (e) => {
        const newFiles = Array.from(e.target.files);
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        e.target.value = ''; // reset input
    };



    const getAcceptTypes = () => {
        if (!files || typeof files !== 'object') return '';

        const acceptTypes = new Set();

        Array.from(files).forEach(file => {
            const type = file.type;
            if (type) {
                acceptTypes.add(type);
            } else {
                const ext = file.name.split('.').pop().toLowerCase();
                acceptTypes.add(`.${ext}`);
            }
        });

        return Array.from(acceptTypes).join(',');
    };


    const handleSubmit = () => {
        console.log('Files:', files);
        console.log('Preview Files:', previewFiles);
    }



    const selectedFile = previewFiles[selectedIndex];
    const fileType = getFileType(selectedFile?.type, selectedFile?.name);






    return (
        <div className="bg-white rounded-lg border border-gray-200 w-[900px] max-h-[90vh] overflow-y-auto p-4 pb-8 relative">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold">Preview</h3>
                <i
                    className='fa-solid fa-xmark text-3xl cursor-pointer hover:scale-110 text-red-600 absolute top-4 right-4'
                    onClick={handleClose}
                ></i>
            </div>

            {selectedFile && (
                <div className="flex flex-col items-center">
                    {fileType === 'image' && (
                        <div className="h-[400px] w-[400px] rounded flex items-center justify-center">
                            <img
                                src={selectedFile.url}
                                alt={selectedFile.name}
                                className="max-h-full max-w-full object-contain rounded-md"
                            />
                        </div>

                    )}
                    {fileType === 'video' && (
                        <video controls className="h-[400px] w-[80%]">
                            <source src={selectedFile.url} type={selectedFile.type} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {fileType === 'audio' && (
                        <audio controls className="w-[80%]">
                            <source src={selectedFile.url} type={selectedFile.type} />
                            Your browser does not support the audio tag.
                        </audio>
                    )}
                    {(fileType === 'pdf' || fileType === 'text') && (
                        <iframe src={selectedFile.url} title={selectedFile.name} className="h-[400px] w-[80%]" />
                    )}
                    {fileType === 'office' || fileType === 'unknown' ? (
                        <a
                            href={selectedFile.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline mt-4"
                        >
                            {selectedFile.name}
                        </a>
                    ) : (
                        <input
                            type="text"
                            placeholder="Add Caption"
                            value={selectedFile.caption}
                            onChange={handleCaptionChange}
                            className=" px-3 py-2 bg-gray-100 rounded-md text-sm focus:outline-none mt-4 w-[80%]"
                        />
                    )}
                </div>
            )}

            {previewFiles.length > 0 && (
                <div className="flex gap-4 mt-8 flex-wrap w-[80%] mx-auto  justify-between">


                    <div className='flex gap-3 items-center  '>
                        {previewFiles.map((file, idx) => {
                            const type = getFileType(file.type, file.name);
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`cursor-pointer border-2 rounded-md ${idx === selectedIndex ? 'border-green-600' : 'border-gray-100'}`}
                                >
                                    {type === 'image' && (
                                        <img src={file.url} alt={file.name} className="h-12 w-12 object-contain rounded" />
                                    )}
                                    {type === 'video' && (
                                        <div className="h-12 w-12 bg-black text-white text-xs flex items-center justify-center rounded">
                                            🎥 Video
                                        </div>
                                    )}
                                    {type === 'audio' && (
                                        <div className="h-12 w-12 bg-gray-700 text-white text-xs flex items-center justify-center rounded">
                                            🔊 Audio
                                        </div>
                                    )}
                                    {type === 'pdf' && (
                                        <div className="h-12 w-12 bg-red-400 text-white text-xs flex items-center justify-center rounded">
                                            📄 PDF
                                        </div>
                                    )}
                                    {type === 'text' && (
                                        <div className="h-12 w-12 bg-green-500 text-white text-xs flex items-center justify-center rounded">
                                            📄 Text
                                        </div>
                                    )}
                                    {(type === 'office' || type === 'unknown') && (
                                        <div className="h-12 w-12 bg-gray-300 text-xs flex items-center justify-center rounded">
                                            📁 {file.name.split('.').pop()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div
                            className="h-12 w-12 bg-gray-100 text-3xl font-bold flex items-center justify-center rounded cursor-pointer"
                            onClick={handleAddMoreClick}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAddMoreFiles}
                            multiple
                            accept={getAcceptTypes()}
                        />

                    </div>


                    <div>
                        <button className=" cursor-pointer p-3 bg-green-600 hover:bg-green-700 rounded-full text-white flex items-center justify-center" onClick={handleSubmit}>
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
                            </svg>
                        </button>
                    </div>


                </div>
            )}
        </div>
    );
}

export default FilePreview;
