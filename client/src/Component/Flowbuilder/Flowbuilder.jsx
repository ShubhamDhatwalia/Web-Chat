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
import CustomNode from './Nodes/CustomNode.jsx';
import QuestionNodeForm from './Nodes/QuestionNodeForm.jsx';
import MessageNodeForm from './Nodes/MessageNodeForm.jsx';
import TemplateNodeFrom from './Nodes/TemplateNodeFrom.jsx';
import DeleteEdgeModel from './DeleteEdgeModel.jsx';
import { MarkerType } from 'reactflow';

import {
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';


const nodeTypes = {
    custom: CustomNode
};





function FlowCanvas({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, setEditNode }) {
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
                setNodes,
                setEditNode,
            }
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const [edgeToDelete, setEdgeToDelete] = useState(null);



    const onConnect = useCallback(
        (params) => {

            const edge = {
                ...params,
                animated: true,
                style: { stroke: '#7C7D7D', strokeWidth: 3 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#00A63E',
                },
            };

            setEdges((eds) => addEdge(edge, eds));

        },
        [setEdges]
    );



    const handleConfirmDeleteEdge = () => {
        setEdges((eds) => eds.filter((e) => e.id !== edgeToDelete.id));
        setEdgeToDelete(null);
    };

    const onEdgeClick = useCallback((event, edge) => {
        event.stopPropagation();
        setEdgeToDelete(edge);
    }, []);




    return (
        <>
            <div className="flex-1 h-[calc(100vh-60px)]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
                    onEdgeClick={onEdgeClick}
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
            <Sidebar onAddNode={handleAddNode} />

            <DeleteEdgeModel
                open={!!edgeToDelete}
                onClose={() => setEdgeToDelete(null)}
                onConfirm={handleConfirmDeleteEdge}
            />

        </>
    );
}


function Flowbuilder({ onFlowChange, chatbot }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(chatbot.flow.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(chatbot.flow.edges || []);
    const [editNode, setEditNode] = useState(null);


    console.log(chatbot);






    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            ...newData,
                        },
                    }
                    : node
            )
        );
    };

    const handleNodesChange = (changes) => {
        const updatedNodes = applyNodeChanges(changes, nodes);
        setNodes(updatedNodes);
        onFlowChange({ nodes: updatedNodes, edges });
    };

    const handleEdgesChange = (changes) => {
        const updatedEdges = applyEdgeChanges(changes, edges);
        setEdges(updatedEdges);
        onFlowChange({ nodes, edges: updatedEdges });
    };


    React.useEffect(() => {
        onFlowChange({ nodes, edges });
    }, [nodes, edges]);



    return (
        <ReactFlowProvider>
            <div className="flex h-[calc(100vh-60px)]">
                <FlowCanvas
                    nodes={nodes}
                    setNodes={setNodes}
                    onNodesChange={handleNodesChange}
                    edges={edges}
                    setEdges={setEdges}
                    onEdgesChange={handleEdgesChange}
                    setEditNode={setEditNode}

                />
            </div>

            {editNode?.data?.subType === 'question' && (
                <QuestionNodeForm node={editNode} onClose={() => setEditNode(null)} />
            )}

            {editNode?.data?.subType === 'message' && (
                <MessageNodeForm node={editNode} onClose={() => setEditNode(null)} updateNodeData={updateNodeData} />
            )}

            {editNode?.data?.subType === 'template' && (
                <TemplateNodeFrom node={editNode} onClose={() => setEditNode(null)} updateNodeData={updateNodeData} />
            )}

        </ReactFlowProvider>
    );
}

export default Flowbuilder;
