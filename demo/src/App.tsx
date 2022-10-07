import { FC, useEffect } from 'react'
import { initialize } from '@caldwell619/family-tree'

export const App: FC = () => {
  useEffect(() => {
    initialize()
  }, [])
  return (
    <>
      <div id='header'>Family Name</div>
      <div id='control_panel'>
        <div className='section'>Control Panel</div>
        <button id='add_child'>Add Child</button>
        <button id='remove_node'>Remove Node</button>
        <button id='zoom_in'>Zoom In</button>
        <button id='zoom_out'>Zoom Out</button>
        <div className='section'>Information Panel</div>
        <div id='information_panel'></div>
      </div>
      <div id='divider'></div>
      <div id='main'>
        <canvas id='canvas'></canvas>
      </div>
    </>
  )
}
