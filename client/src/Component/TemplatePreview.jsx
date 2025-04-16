import React, { useEffect, useState } from 'react';

function TemplatePreview({ templateId, liveTemplateData }) {
    const [template, setTemplate] = useState(null);

    const sampleTemplate = {
        components: [
            { type: 'HEADER', format: 'TEXT', text: 'Sample Header' },
            { type: 'BODY', text: 'This is a sample body text for your WhatsApp template.\nHere is the second line.' },
            { type: 'FOOTER', text: 'Sample footer text.' },
            {
                type: 'BUTTONS',
                buttons: [
                    { type: 'PHONE_NUMBER', text: 'Call Now', phone_number: '+911234567890' },
                ],
            },
        ],
    };

    useEffect(() => {
        if (liveTemplateData && Array.isArray(liveTemplateData.components)) {
            setTemplate(liveTemplateData);
        } else {
            const storedTemplates = localStorage.getItem('whatsappTemplates');
            if (storedTemplates && templateId) {
                const templates = JSON.parse(storedTemplates);
                const matched = templates.find((t) => t.id === templateId);
                setTemplate(matched || sampleTemplate);
            } else {
                setTemplate(sampleTemplate);
            }
        }
    }, [templateId, liveTemplateData]);

    if (!template || !template.components) {
        return (
            <p className="text-gray-500 mt-5">
                Loading template preview...
            </p>
        );
    }

    const header = template.components.find((comp) => comp.type === 'HEADER');
    const body = template.components.find((comp) => comp.type === 'BODY');
    const footer = template.components.find((comp) => comp.type === 'FOOTER');
    const buttonComponent = template.components.find((comp) => comp.type === 'BUTTONS');
    const buttons = buttonComponent?.buttons || [];

    // Helper function to render text with line breaks
    const renderTextWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className='mt-4 bg-[url("./assets/whatsapp-bg.jpg")] rounded-md bg-no-repeat bg-center bg-cover opacity-70 p-4 min-h-[calc(100vh-190px)]'>
            <div className='mt-5 p-2 bg-white max-w-[300px] rounded-md'>

                {/* Header */}
                {header && header.format === 'TEXT' && (
                    <h2 className='font-bold text-md mb-2'>{header.text}</h2>
                )}
                {header && header.format === 'IMAGE' && (
                    <div className='max-h-[140px] overflow-hidden mb-2'>
                        <img
                            src={header.imagePreview || header.example?.header_handle?.[0] || ''} // fallback
                            alt="Header"
                            className="w-full object-cover"
                        />
                    </div>
                )}

                {/* Body */}
                {body && (
                    <p className='mb-2 text-sm text-black'>
                        {renderTextWithNewlines(body.text)}
                    </p>
                )}

                {/* Footer */}
                {footer && <p className='text-gray-500 text-xs'>{footer.text}</p>}

                {/* Buttons */}
                {buttons.length > 0 && (
                    <div className='mt-3'>
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
            </div>
        </div>
    );
}

export default TemplatePreview;
