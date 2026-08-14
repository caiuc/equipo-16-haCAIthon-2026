import React from 'react'
import { ReactFlow, Position } from '@xyflow/react';
import { AnimatedSvgEdge } from "./animated-svg-edge";

const edgeTypes = {
  animatedSvgEdge: AnimatedSvgEdge,
};

function CreateText({ nem = 0, ranking = 0, m = 0, l = 0, c = 0, h = null } = {}) {
  if (h === null) {
    return `NEM ${nem} \n Ranking ${ranking} \n Matematicas ${m} \n Lenguaje ${l} \n Ciencias ${c} `;
  }
  return `NEM ${nem} \n Ranking ${ranking} \n Matematicas ${m} \n Lenguaje ${l} \n Historia ${h} `;
}

function Diagram({nem,ranking,m,l,c,h, top, middle, low}) {

  const defaultNodes = [
    {
      id: "1",
      position: { x: 200, y: 174 },
      data: { label:  CreateText(nem,ranking,m,l,c,h)},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "2",
      position: { x: 400, y: 200 },
      data: { label: middle },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "3",
      position: { x: 400, y: 100 },
      data: { label: top },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "4",
      position: { x: 400, y: 300 },
      data: { label: low },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
  ];
  
  const defaultEdges = [
    {
      id: "1->2",
      source: "1",
      target: "2",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "animatedSvgEdge",
      // label: "Label 1->2",
      data: {
        duration: 2,
        shape: "circle",
        path: "smoothstep",
        repeat: 1,
      },
    },
        {
      id: "1->3",
      source: "1",
      target: "3",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "animatedSvgEdge",
      // label: "Label 1->3",
      data: {
        duration: 2,
        shape: "circle",
        path: "smoothstep",
        repeat: 1
      },
    },
        {
      id: "1->4",
      source: "1",
      target: "4",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "animatedSvgEdge",
      // label: "Label 1->4",
      data: {
        duration: 2,
        shape: "circle",
        path: "smoothstep",
        repeat: 1
      },
    },
  ];
  
  return (
    <div className="h-full w-full">
      <ReactFlow
        defaultNodes={defaultNodes}
        edgeTypes={edgeTypes}
        defaultEdges={defaultEdges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        preventScrolling={false}
      >
      </ReactFlow>
    </div>
  )
}

export default Diagram