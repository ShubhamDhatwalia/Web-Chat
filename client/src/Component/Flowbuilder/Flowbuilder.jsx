// Flowbuilder.jsx
import React, { useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    addEdge,
    useNodesState,
    useEdgesState,
    MiniMap,
    ReactFlowProvider,
    useReactFlow
} from 'reactflow';

import 'reactflow/dist/style.css';
import Sidebar from './Sidebar.jsx';
import CustomNode from './CustomNode.jsx';

const nodeTypes = {
    custom: CustomNode
};

function FlowCanvas({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) {
    const { getViewport } = useReactFlow();

    const handleAddNode = (label, subType) => {
        const id = `${subType}-${Date.now()}`;
        const viewport = getViewport();

        const position = {
            x: -viewport.x / viewport.zoom + 300,
            y: -viewport.y / viewport.zoom + 200
        };

        const newNode = {
            id,
            type: 'custom',
            position,
            data: {
                id,
                label,
                subType,
                content: {},
                onOpenMenu: handleOpenMenu
            }
        };
        setNodes((nds) => [...nds, newNode]);
    };

    console.log(nodes )
    console.log(edges)
    
    const onConnect = useCallback(
        (params) => {

            const edge = { ...params, animated: true };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );
    const handleOpenMenu = () => {
        console.log('Open menu triggered');
    };

    return (
        <>
            <Sidebar onAddNode={handleAddNode} />
            <div className="flex-1 h-[calc(100vh-60px)]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    defaultViewport={{ x: 0, y: 0, zoom: 10 }}
                    fitView


                    className="top-[0px] bg-gray-50"
                >
                    <MiniMap
                        nodeColor={(node) => {
                            const type = node.data?.subType;
                            switch (type) {
                                case 'question':
                                    return '#F79431';
                                case 'message':
                                    return '#E25866';
                                case 'template':
                                    return '#6C7ED6';
                                default:
                                    return '#ccc';
                            }
                        }}
                        nodeStrokeColor={() => '#333'}
                        zoomable={true}
                        zoomStep={0.5}
                        pannable={true}
                        className='cursor-pointer'
                    />

                    <Controls />
                    <Background variant="lines" gap={80} size={20} color="#EEF0F6" />
                </ReactFlow>
            </div>
        </>
    );
}

function Flowbuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    return (
        <ReactFlowProvider>
            <div className="flex h-[calc(100vh-60px)]">
                <FlowCanvas
                    nodes={nodes}
                    setNodes={setNodes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    setEdges={setEdges}
                    onEdgesChange={onEdgesChange}
                />
            </div>
        </ReactFlowProvider>
    );
}

export default Flowbuilder;
