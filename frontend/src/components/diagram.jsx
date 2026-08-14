import React from 'react'
import { ReactFlow, Position } from '@xyflow/react';
import { AnimatedSvgEdge } from "./animated-svg-edge";
import "./diagram.css"

const edgeTypes = {
  animatedSvgEdge: AnimatedSvgEdge,
};

function CreateText({ nem = 0, ranking = 0, m = 0, l = 0, c = 0, h = null } = {}) {
  if (h === null) {
    return `NEM ${nem} \n Ranking ${ranking} \n Matematicas ${m} \n Lenguaje ${l} \n Ciencias ${c} `;
  }
  return `NEM ${nem} \n Ranking ${ranking} \n Matematicas ${m} \n Lenguaje ${l} \n Historia ${h} `;
}

function hexToRgba(hex, alpha) {
  // Convierte un color hex (#rrggbb o #rgb) a rgba(r, g, b, a)
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function Diagram({nem,ranking,m,l,c,h, top, middle, low, nodeBackgroundColor = "#ffffff", nodeOpacity = 1}) {

  // La transparencia (nodeOpacity) se aplica solo al fondo del nodo
  // mediante rgba, manteniendo el texto completamente legible.
  const nodeStyle = {
    backgroundColor: hexToRgba(nodeBackgroundColor, nodeOpacity),
  };

  const defaultNodes = [
    {
      id: "1",
      position: { x: 200, y: 161 },
      data: { label:  CreateText(nem,ranking,m,l,c,h)},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: nodeStyle,
    },
    {
      id: "2",
      position: { x: 400, y: 200 },
      data: { label: middle },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: nodeStyle,
    },
    {
      id: "3",
      position: { x: 400, y: 100 },
      data: { label: top },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: nodeStyle,
    },
    {
      id: "4",
      position: { x: 400, y: 300 },
      data: { label: low },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: nodeStyle,
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
    <div style={{ width: '100%', height: 500 }}>
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