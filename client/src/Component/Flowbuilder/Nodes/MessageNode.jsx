import React, { useEffect, useState } from 'react';

function MessageNode({ data }) {
    const content = data?.content || {};
    const message = content?.message;
    const image = content?.image || null;

    const [imageSrc, setImageSrc] = useState(null);




    console.log(data);

   useEffect(() => {
    if (image instanceof File) {
        const objectUrl = URL.createObjectURL(image);
        setImageSrc(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof image === 'string') {
        setImageSrc(image);
    } else {
        // If image is null or undefined, clear the imageSrc
        setImageSrc(null);
    }
}, [image]);





    return (
        <div className='p-2'>
            <div className="whitespace-pre-line text-sm text-gray-800">
                {message}
            </div>

            {imageSrc && (
                <div className="mt-3">
                    <img
                        src={imageSrc}
                        alt="Message Attachment"
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}

export default MessageNode;
