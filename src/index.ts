import { Tree } from './tree'

export const initialize = (canvasId = 'canvas') => {
  const canvas = document.getElementById(canvasId)
  // TODO: check if element is canvas
  if (!canvas) throw new Error('Cannot find canvas element')
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const context = canvas.getContext('2d')
  const tree = new Tree({ text: 'Maekar I' })
  let nodes = tree.getNodeList(tree)
  let currNode = tree

  // TODO: Move to exported logic handlers
  const add_child_button = document.getElementById('add_child')
  const remove_node = document.getElementById('remove_node')
  const zoom_in = document.getElementById('zoom_in')
  const zoom_out = document.getElementById('zoom_out')

  canvas.addEventListener(
    'click',
    event => {
      const x = event.pageX - canvas.offsetLeft
      const y = event.pageY - canvas.offsetTop
      for (let i = 0; i < nodes.length; i++) {
        if (
          x > nodes[i].xPos &&
          y > nodes[i].yPos &&
          x < nodes[i].xPos + nodes[i].width &&
          y < nodes[i].yPos + nodes[i].height
        ) {
          currNode.selected(false)
          nodes[i].selected(true)
          currNode = nodes[i]
          tree.clear(context)
          tree.draw(context, tree)
          updatePage(currNode)
          break
        }
      }
    },
    false
  )

  canvas.addEventListener(
    'mousemove',
    event => {
      const x = event.pageX - canvas.offsetLeft
      const y = event.pageY - canvas.offsetTop
      for (let i = 0; i < nodes.length; i++) {
        if (
          x > nodes[i].xPos &&
          y > nodes[i].yPos &&
          x < nodes[i].xPos + nodes[i].width &&
          y < nodes[i].yPos + nodes[i].height
        ) {
          canvas.style.cursor = 'pointer'
          break
        } else {
          canvas.style.cursor = 'auto'
        }
      }
    },
    false
  )
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  add_child_button.addEventListener('click', () => {
    currNode.addChild(new Tree({ text: 'Child of ' + currNode.text }))
    tree.clear(context)
    nodes = tree.getNodeList(tree)
    tree.draw(context, tree)
  })
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  remove_node.addEventListener('click', () => {
    tree.destroy(currNode)
    tree.clear(context)
    nodes = tree.getNodeList(tree)
    tree.draw(context, tree)
  })
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  zoom_in.addEventListener('click', () => {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].width *= 1.05
      nodes[i].height *= 1.05
    }
    tree.config.width *= 1.05
    tree.config.height *= 1.05
    tree.clear(context)
    tree.draw(context, tree)
  })
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  zoom_out.addEventListener('click', () => {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].width = nodes[i].width * 0.95
      nodes[i].height = nodes[i].height * 0.95
    }
    tree.config.width *= 0.95
    tree.config.height *= 0.95
    tree.clear(context)
    tree.draw(context, tree)
  })
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  context.canvas.width = document.getElementById('main').offsetWidth
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  context.canvas.height = document.getElementById('main').offsetHeight
  populateDummyData(tree)
  nodes = tree.getNodeList(tree)
  tree.draw(context, tree)
  return tree
}

export const updatePage = (tree: any) => {
  var info_panel = document.getElementById('information_panel')
  var header = document.getElementById('header')
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  header.innerHTML = 'Targaryen Family'
  var info_panel_html = '<ul>'
  info_panel_html += '<li>First Name: ' + tree.text + '</li>'
  info_panel_html += '<li>Last Name: ' + 'Targaryen' + '</li>'
  info_panel_html += '</ul>'
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  info_panel.innerHTML = info_panel_html
}

export const populateDummyData = (tree: Tree<unknown>) => {
  tree.selected(true)
  updatePage(tree)
  tree.addChild(new Tree({ text: 'Aerion' }))
  tree.addChild(new Tree({ text: 'Daeron' }))
  tree.addChild(new Tree({ text: 'Aemon' }))
  tree.addChild(new Tree({ text: 'Aegon V' }))
  tree.addChild(new Tree({ text: 'Rhae' }))
  tree.addChild(new Tree({ text: 'Daella' }))
  tree.getChildAt(0)?.addChild(new Tree({ text: 'Maegor' }))
  tree.getChildAt(1)?.addChild(new Tree({ text: 'Vaella' }))
  tree.getChildAt(3)?.addChild(new Tree({ text: 'Duncan' }))
  tree.getChildAt(3)?.addChild(new Tree({ text: 'Jaehaerys II' }))
  tree.getChildAt(3)?.addChild(new Tree({ text: 'Shaera' }))
  tree.getChildAt(3)?.addChild(new Tree({ text: 'Daeron' }))
  tree.getChildAt(3)?.addChild(new Tree({ text: 'Rhaelle' }))
  tree.getDescendent(11)?.addChild(new Tree({ text: 'Aerys II' }))
  tree.getDescendent(11)?.addChild(new Tree({ text: 'Rhaella' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Rhaegar' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Shaena' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Daeron' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Aegon' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Jaehaerys' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Viserys' }))
  tree.getDescendent(15)?.addChild(new Tree({ text: 'Daenerys' }))
  tree.getDescendent(17)?.addChild(new Tree({ text: 'Rhaenys' }))
  tree.getDescendent(17)?.addChild(new Tree({ text: 'Aegon' }))
  tree.getDescendent(23)?.addChild(new Tree({ text: 'Rhaego' }))
}
