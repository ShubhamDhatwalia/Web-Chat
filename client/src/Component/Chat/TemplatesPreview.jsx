import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';






function TemplatesPreview({ templateId, onClose, onBack, selectedUser }) {


    const [template, setTemplate] = useState(null);



    const replaceVariables = (text, component, parameterFormat) => {
        if (!text || !component.example) return text;

        if (parameterFormat === 'POSITIONAL') {
            let values = [];

            if (component.type === 'HEADER') {
                const headerValues = component.example?.header_text;
                values = Array.isArray(headerValues[0]) ? headerValues[0] : headerValues;
            } else if (component.type === 'BODY') {
                const bodyValues = component.example?.body_text;
                values = Array.isArray(bodyValues[0]) ? bodyValues[0] : bodyValues;
            }

            return text.replace(/{{(\d+)}}/g, (match, index) => values?.[parseInt(index) - 1] || match);
        }

        if (parameterFormat === 'NAMED') {
            let namedValues = [];

            // Support both header and body
            if (component.type === 'HEADER') {
                namedValues = component.example?.header_text_named_params || [];
            } else if (component.type === 'BODY') {
                namedValues = component.example?.body_text_named_params || [];
            }

            return text.replace(/{{(\w+)}}/g, (match, key) => {
                const param = namedValues.find((p) => p.param_name === key);
                return param?.example || match;
            });
        }

        return text;
    };

    useEffect(() => {
        const storedTemplates = localStorage.getItem('whatsappTemplates');
        if (storedTemplates && templateId) {
            const templates = JSON.parse(storedTemplates);
            const matched = templates.find((t) => t.id === templateId);
            setTemplate(matched || null);

            console.log(templates)
            console.log(storedTemplates)
        }


    }, [templateId]);


    const header = template?.components.find((comp) => comp.type === 'HEADER');
    const body = template?.components.find((comp) => comp.type === 'BODY');
    const footer = template?.components.find((comp) => comp.type === 'FOOTER');
    const buttonComponent = template?.components.find((comp) => comp.type === 'BUTTONS');
    const buttons = buttonComponent?.buttons || [];

    const renderTextWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };




    const modalRef = useRef(null);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };





    const handleSubmit = async (e) => {
        e.preventDefault();




        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: selectedUser.phone,
            type: "template",
            template: {
                name: template?.name || '',
                language: {
                    code: template?.language || 'en_US'
                },
                components: []
            }
        };

        // Dynamically add components based on selectedTemplate
        if (template?.components) {
            template.components.forEach(component => {
                // HEADER
                if (component.type === "HEADER") {
                    const headerParams = [];

                    // Named variable format
                    if (component?.example?.header_text_named_params) {
                        component.example.header_text_named_params.forEach(param => {
                            headerParams.push({
                                type: "text",
                                text: param.example,
                                parameter_name: param.param_name
                            });
                        });
                    }
                    // Positional format
                    else if (component?.example?.header_text?.[0]) {
                        const exampleHeader = component.example.header_text[0];
                        headerParams.push({
                            type: "text",
                            text: exampleHeader
                        });
                    }

                    if (headerParams.length > 0) {
                        payload.template.components.push({
                            type: "HEADER",
                            parameters: headerParams
                        });
                    }
                }

                // BODY
                if (component.type === "BODY") {
                    const bodyParams = [];

                    // Named variable format
                    if (component?.example?.body_text_named_params) {
                        component.example.body_text_named_params.forEach(param => {
                            bodyParams.push({
                                type: "text",
                                text: param.example,
                                parameter_name: param.param_name
                            });
                        });
                    }
                    // Positional format
                    else if (component?.example?.body_text?.[0]) {
                        const exampleBody = component.example.body_text[0];
                        if (Array.isArray(exampleBody)) {
                            exampleBody.forEach(value => {
                                bodyParams.push({
                                    type: "text",
                                    text: value
                                });
                            });
                        }
                    }

                    if (bodyParams.length > 0) {
                        payload.template.components.push({
                            type: "BODY",
                            parameters: bodyParams
                        });
                    }
                }
            });
        }

        console.log(payload);

        try {
            await axios.post(`/sendTemplateMessages`, payload);
            toast.success("Template sent successfully");
        } catch (error) {
            console.error(error);
        }


    };






    return (
        <>
            <div ref={modalRef}>

                <div className=' p-2 bg-white   rounded-md'>

                    {template && (
                        <div className='flex items-center justify-between mb-8 pb-2 border-b border-gray-300'>
                            <h4 className='font-semibold text-lg'>{template.name}</h4>

                            <i
                                className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600 ' onClick={() => onClose()}

                            ></i>
                        </div>
                    )}

                    {/* Header */}
                    {header && header.format === 'TEXT' && (
                        <h2 className='font-bold text-md mb-2 break-words  '>
                            {replaceVariables(header.text, header, template.parameter_format)}
                        </h2>
                    )}
                    {header && header.format === 'IMAGE' && (
                        <div className=' overflow-hidden mb-2'>
                            <img
                                src={header.imagePreview || header.example?.header_handle?.[0] || ''}
                                alt="Header"
                                className="w-full  rounded-sm"
                            />
                        </div>
                    )}

                    {/* Body */}
                    {body && (
                        <p className='mb-2 text-sm text-black break-words'>
                            {renderTextWithNewlines(
                                replaceVariables(body.text, body, template.parameter_format)
                            )}
                        </p>
                    )}

                    {/* Footer */}
                    {footer && <p className='text-gray-500 text-xs break-words'>{footer.text}</p>}

                    {/* Buttons */}
                    {buttons.length > 0 && (
                        <div className='mt-3 flex'>
                            {buttons.map((btn, index) => {
                                if (btn.type === 'PHONE_NUMBER') {
                                    return (
                                        <div key={index} className='text-center py-2 border-t-2 border-gray-100'>
                                            <a
                                                href={`tel:${btn.phone_number}`}
                                                className='text-blue-500 font-semibold text-sm py-1 px-2 mt-2 rounded text-center'
                                            >
                                                <i className="fa-solid fa-phone text-blue-500 text-sm mr-2 font-semibold"></i>
                                                {btn.text}
                                            </a>
                                        </div>
                                    );
                                } else if (btn.type === 'URL') {
                                    return (
                                        <div key={index} className='text-center py-2 border-t-2 border-gray-100'>
                                            <a
                                                href={btn.url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='text-blue-500 font-semibold py-1 px-2 mt-2 rounded text-center text-sm'
                                            >
                                                <i className="fa-solid fa-arrow-up-right-from-square text-blue-500 text-sm mr-2 font-semibold"></i>
                                                {btn.text}
                                            </a>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index} className='text-center py-2 border-t-2 border-gray-100'>
                                            <button className='text-blue-500 font-semibold py-1 px-2 rounded text-sm text-center cursor-pointer'>
                                                <i className="fa-solid fa-reply text-blue-500 text-sm mr-2 font-semibold"></i>
                                                {btn.text}
                                            </button>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}








                    <div className='mt-6 flex gap-4 items-center justify-end'>
                        <button type='button' className='px-3 py-1 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200' onClick={() => onBack(null)}>Back</button>
                        <button type='submit' className='px-3 py-1 rounded-md bg-green-600 cursor-pointer hover:bg-green-700 text-white' onClick={(e) => handleSubmit(e)} >Send</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default TemplatesPreview