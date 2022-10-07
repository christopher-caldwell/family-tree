import { FC, useEffect, useRef } from 'react'
import { getTree, Handlers } from '@caldwell619/family-tree'

export const App: FC = () => {
  const handlers = useRef<Handlers>()
  useEffect(() => {
    const { initialize, handlers: treeHandlers } = getTree()
    handlers.current = treeHandlers
    initialize()
  }, [])
  return (
    <>
      <div id='header'>Family Name</div>
      <div id='control_panel'>
        <div className='section'>Control Panel</div>
        <button id='add_child' onClick={handlers.current?.onAdd}>
          Add Child
        </button>
        <button id='remove_node' onClick={handlers.current?.onRemove}>
          Remove Node
        </button>
        <button id='zoom_in' onClick={() => handlers.current?.onZoomIn()}>
          Zoom In
        </button>
        <button id='zoom_out' onClick={() => handlers.current?.onZoomOut()}>
          Zoom Out
        </button>
        <div className='section'>Information Panel</div>
        <div id='information_panel'></div>
      </div>
      <div id='divider'></div>
      <div id='main'>
        <canvas
          //@ts-expect-error
          onClick={handlers.current?.onClick}
          //@ts-expect-error
          onMouseMove={handlers.current?.onMouseMove}
          id='canvas'
        />
      </div>
    </>
  )
}
