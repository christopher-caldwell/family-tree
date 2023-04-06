import { Tree } from './tree'

export const getTree = <TData>(treeData: TreeData[], canvasId = 'canvas') => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) throw new Error('Cannot find canvas element')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Cannot find canvas context')
  const rootNode = treeData[0]
  if (!rootNode) throw new Error('Cannot find root node')
  const tree = new Tree<TData>({ text: rootNode.text })

  let nodes = tree.getNodeList(tree)
  console.log(nodes)
  let currNode = tree

  /** Canvas onClick */
  const onClick = (event: MouseEvent) => {
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
        // updatePage(currNode)
        break
      }
    }
  }

  const onMouseMove = (event: MouseEvent) => {
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
  }

  const onAdd = () => {
    currNode.addChild(new Tree({ text: 'Child of ' + currNode.text }))
    tree.clear(context)
    nodes = tree.getNodeList(tree)
    tree.draw(context, tree)
  }

  const onRemove = () => {
    tree.destroy(currNode)
    tree.clear(context)
    nodes = tree.getNodeList(tree)
    tree.draw(context, tree)
  }

  /**
   * Zooms in the tree
   * @param step Optional number to determine how far each click gets zoomed. Default: `1.05` zooms 5% each time
   */
  const onZoomIn = (step: number = 1.05) => {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].width *= step
      nodes[i].height *= step
    }
    tree.config.width *= step
    tree.config.height *= step
    tree.clear(context)
    tree.draw(context, tree)
  }

  /**
   * Zooms out the tree
   * @param step Optional number to determine how far each click gets zoomed. Default: `0.95` zooms 5% each time
   */
  const onZoomOut = (step: number = 0.95) => {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].width = nodes[i].width * step
      nodes[i].height = nodes[i].height * step
    }
    tree.config.width *= step
    tree.config.height *= step
    tree.clear(context)
    tree.draw(context, tree)
  }

  const initialize = () => {
    // TODO: change this
    const main = document.getElementById('main')
    if (main) {
      context.canvas.width = main.offsetWidth
      context.canvas.height = main.offsetHeight
    }
    populateDummyData(tree, rootNode.children || [])
    // nodes = tree.getNodeList(tree)
    tree.draw(context, tree)
  }

  return {
    context,
    initialize,
    handlers: {
      onClick,
      onAdd,
      onZoomIn,
      onZoomOut,
      onMouseMove,
      onRemove
    }
  }
}

export interface Handlers {
  onClick: (event: MouseEvent) => void
  onAdd: () => void
  onZoomIn: (step?: number) => void
  onZoomOut: (step?: number) => void
  onMouseMove: (event: MouseEvent) => void
  onRemove: () => void
}

interface TreeData {
  text: string
  children?: TreeData[]
}
export const populateDummyData = <TData>(tree: Tree<TData>, treeData: TreeData[]) => {
  const renderChildren = (rootTree: Tree<TData>, children: TreeData[]) => {
    for (const child of children) {
      const newChild = rootTree.addChild(new Tree({ text: child.text }))
      if (child.children) {
        renderChildren(newChild, child.children)
      }
    }
  }
  renderChildren(tree, treeData)
}
