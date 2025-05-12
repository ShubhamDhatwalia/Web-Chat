import React from 'react'
import { Handle, Position } from 'reactflow';




function CustomNode({ data }) {
    const { label, subType, onOpenMenu, id, content } = data;

    return (
        <>

            <div className="bg-white rounded shadow-xl p-2 w-56 relative cursor-all-scroll hover:shadow-3xl">
                {/* Title + Dots */}
                <div className="flex justify-between items-center border-b pb-1 mb-2 bg-">
                    <strong className="text-sm capitalize">{label}</strong>
                    <button onClick={() => onOpenMenu(id)} className="hover:bg-gray-200 rounded p-1">
                        ⋮
                    </button>
                </div>


                {/* Dynamic content per node subType */}
                <div className="text-xs text-gray-600">
                    {subType === 'question' && (
                        <div>❓ Question: {content?.question || 'No question yet'}</div>
                    )}
                    {subType === 'message' && (
                        <div>💬 Message: {content?.message || 'Empty message'}</div>
                    )}
                    {subType === 'template' && (
                        <div>📄 Template: {content?.templateName || 'Unnamed'}</div>
                    )}
                </div>


                {/* Handles */}
                <Handle
                    type="target"
                    position={Position.Left}
                    style={{ background: '#F79431', width: 10, height: 10, borderRadius: '50%' }}
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    style={{ background: '#00A63E', width: 10, height: 10, borderRadius: '50%' }}
                />


            </div>
        </>
    )
}

export default CustomNode