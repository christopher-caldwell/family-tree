// This breaks the tree, so keeping it here for now
interface Config {
  width: number
  height: number
  color: string
  bgcolor: string
}
interface TreeArgs<TData> extends Partial<Config> {
  text: string
  parentId?: number | null
  treeData?: TData
}
const config: Config = {
  width: 100,
  height: 50,
  color: 'black',
  bgcolor: 'white'
}

export class Tree<TData> {
  uid: number
  parentId: number | null
  text: string
  width: number
  height: number
  color: string
  bgcolor: string
  treeData: TData
  config: Config
  count: number
  xPos: number
  yPos: number
  prelim: number
  modifier: number
  leftNeighbor: Tree<TData> | null
  rightNeighbor: Tree<TData> | null
  parentTree: Tree<TData> | null
  children: Tree<TData>[]

  constructor({ text, parentId = null, width, height, color, bgcolor, treeData = {} as TData }: TreeArgs<TData>) {
    this.text = text
    this.parentId = parentId
    this.uid = this.count + 1
    this.count++
    this.text = text
    this.width = width || config.width
    this.height = height || config.height
    this.color = color || config.color
    this.bgcolor = bgcolor || config.bgcolor
    this.treeData = treeData
    this.xPos = 0
    this.yPos = 0
    this.prelim = 0
    this.modifier = 0
    this.leftNeighbor = null
    this.rightNeighbor = null
    this.parentTree = null
    this.children = []
  }

  /**
   * Gets the vertical level of the tree.
   * @returns {number} A number representing the vertical level of the tree.
   */
  getLevel(): number {
    return this.parentId === -1 ? 0 : this.parentTree?.getLevel() || 0 + 1
  }

  /**
   * Sets the text color of the tree node.
   * @param color The color to change it to.
   */
  setColor(color: string) {
    this.color = color
  }

  /**
   * Sets the background color of the tree node.
   * @param color The color to change it to.
   */
  setbgColor(color: string) {
    this.bgcolor = color
  }

  /**
   * Visually changes the style of the node if it is 'selected'.
   * @param bool A true or false value representing if node is selected or not.
   */
  selected(bool: boolean) {
    if (bool) {
      this.setColor('white')
      this.setbgColor('red')
    } else {
      this.setColor('black')
      this.setbgColor('white')
    }
  }

  /**
   * Returns the number of children of this tree.
   * @returns {number} The number of children.
   */
  numChildren(): number {
    return this.children.length
  }

  /**
   * Returns the left sibling of this tree.
   * @returns {Tree | null} The left sibling or null.
   */
  getLeftSibling(): Tree<TData> | null {
    return this.leftNeighbor && this.leftNeighbor.parentTree === this.parentTree ? this.leftNeighbor : null
  }

  /**
   * Returns the right sibling of this tree.
   * @returns {Tree | null} The left sibling or null.
   */
  getRightSibling(): Tree<TData> | null {
    return this.rightNeighbor && this.rightNeighbor.parentTree === this.parentTree ? this.rightNeighbor : null
  }

  /**
   * Returns the child at a specified index.
   * @param index The specified index.
   * @returns {Tree | null} The child if found or null.
   */
  getChildAt(index: number): Tree<TData> | null {
    return this.children[index]
  }

  /**
   * Searches children and returns a tree by UID.
   * @param id The UID to search for.
   * @returns The child if found or null.
   */
  getChild(id: number): Tree<TData> | null {
    var i
    for (i = 0; i < this.children.length; i++) {
      if (this.children[i].uid === id) {
        return this.children[i]
      }
    }
    return null
  }

  /**
   * Return the first child of this tree.
   * @returns The child node.
   */
  getFirstChild() {
    return this.getChildAt(0)
  }

  /**
   * Gets the last child of this tree.
   * @returns The child node.
   */
  getLastChild() {
    return this.getChildAt(this.numChildren() - 1)
  }

  /**
   * Returns an X value representing the center location of all this tree's children.
   * @returns {*} The center X value.
   */
  getChildrenCenter() {
    const firstChild = this.getFirstChild()
    const lastChild = this.getLastChild()
    // TODO: Check here is 0 is ok
    return (
      firstChild?.prelim || 0 + ((lastChild?.prelim || 0) - (firstChild?.prelim || 0) + (lastChild?.width || 0)) / 2
    )
  }

  /**
   * Adds a tree node to the children to this tree.
   * @param tree The tree to be added.
   */
  addChild(tree: Tree<TData>) {
    tree.parentTree = this
    tree.parentId = this.uid
    this.children.push(tree)
    return tree
  }

  /**
   * Find and return a descendant by the UID.
   * @param id The UID to search for.
   * @returns The found tree node or null if not found.
   */
  getDescendent(id: number): Tree<TData> | null {
    var children = this.children
    var found
    if (this.getChild(id)) {
      return this.getChild(id)
    } else {
      for (var i = 0; i < children.length; i++) {
        found = children[i].getDescendent(id)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  /**
   * Removes a tree from it's parents list of children. This effectively removes the tree and all of its
   * descendants from an existing tree.
   * @param tree The tree to be removed.
   */
  destroy(tree: Tree<TData> | null) {
    if (!tree?.parentTree) {
      alert('Removing root node not supported at this time')
      return
    }
    var children = tree.parentTree.children
    for (var i = 0; i < children.length; i++) {
      if (children[i].uid === tree.uid) {
        children.splice(i, 1)
        break
      }
    }
  }

  /**
   * Get an array of all nodes in a tree.
   * @param tree The tree.
   * @returns {Array} An array of tree nodes.
   */
  getNodeList(tree: Tree<TData>): Tree<TData>[] {
    let nodeList = []
    nodeList.push(tree)
    for (var i = 0; i < tree.numChildren(); i++) {
      const targetTree = tree.getChildAt(i)
      if (!targetTree) continue
      nodeList = nodeList.concat(this.getNodeList(targetTree))
    }
    return nodeList
  }

  /**
   * Clears the canvas.
   * @param context The 2-d context of an html canvas element.
   */
  clear(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  }

  /**
   * Draws a well-formed tree on a canvas.
   * @param context The 2-d context of a canvas html element.
   * @param tree The tree that will be drawn.
   */
  draw(context: CanvasRenderingContext2D, tree: Tree<TData>) {
    var config = {
        maxDepth: 100,
        levelSeparation: 40,
        siblingSeparation: 20,
        subtreeSeparation: 20,
        topXAdjustment: 0,
        topYAdjustment: 20
      },
      maxLevelHeight: number[] = [],
      maxLevelWidth = [],
      previousLevelTree: any = [],
      rootXOffset = 0,
      rootYOffset = 0,
      /**
       * Saves the height of a tree at a specified level.
       * @param tree The tree.
       * @param level The current vertical level of the tree.
       */
      setLevelHeight = function (tree: Tree<TData>, level: number) {
        maxLevelHeight[level] = tree.height
      },
      /**
       * Saves the width of a tree at a specified level.
       * @param tree The tree.
       * @param level The current vertical level of the tree.
       */
      setLevelWidth = function (tree: Tree<TData>, level: any) {
        maxLevelWidth[level] = tree.width
      },
      /**
       * Sets the neighbors of the tree.
       * @param tree The specified tree
       * @param level The vertical level of the tree.
       */
      setNeighbors = function (tree: Tree<TData>, level: any) {
        tree.leftNeighbor = previousLevelTree[level]
        if (tree.leftNeighbor) tree.leftNeighbor.rightNeighbor = tree
        previousLevelTree[level] = tree
      },
      /**
       * Returns the leftmost descendant of the tree.
       * @param tree The specified tree.
       * @param level The vertical level of the tree.
       * @param maxlevel The maximum level in which to stop searching.
       * @returns {*} The leftmost descendant if found, or null.
       */
      // @ts-expect-error TS(7023): 'getLeftMost' implicitly has return type 'any' bec... Remove this comment to see the full error message
      getLeftMost = (tree: Tree<TData>, level: number, maxlevel: any) => {
        if (level >= maxlevel) return tree
        if (tree.numChildren() === 0) return null
        var n = tree.numChildren()
        for (var i = 0; i < n; i++) {
          var iChild = tree.getChildAt(i)
          // @ts-expect-error TS(7022): 'leftmostDescendant' implicitly has type 'any' bec... Remove this comment to see the full error message
          var leftmostDescendant = getLeftMost(iChild, level + 1, maxlevel)
          if (leftmostDescendant !== null) return leftmostDescendant
        }
        return null
      },
      /**
       * Gets the width of the tree.
       * @param tree The specified tree.
       * @returns {number} The width of the tree.
       */
      getNodeSize = function (tree: Tree<TData>) {
        return tree.width
      },
      /**
       * Part of the first traversal of the tree for positioning. Smaller subtrees that could float between
       * two adjacent larger subtrees are evenly spaced out.
       * @param tree
       * @param level
       */
      apportion = function (tree: Tree<TData>, level: any) {
        var firstChild = tree.getFirstChild(),
          firstChildLeftNeighbor = firstChild?.leftNeighbor,
          j = 1
        for (var k = config.maxDepth - level; firstChild != null && firstChildLeftNeighbor != null && j <= k; ) {
          var modifierSumRight = 0
          var modifierSumLeft = 0
          var rightAncestor: Tree<TData> | null = firstChild
          var leftAncestor: Tree<TData> | null = firstChildLeftNeighbor
          for (var l = 0; l < j; l++) {
            rightAncestor = rightAncestor?.parentTree || null
            leftAncestor = leftAncestor?.parentTree || null
            modifierSumRight += rightAncestor?.modifier || 0
            modifierSumLeft += leftAncestor?.modifier || 0
          }
          var totalGap =
            firstChildLeftNeighbor.prelim +
            modifierSumLeft +
            getNodeSize(firstChildLeftNeighbor) +
            config.subtreeSeparation -
            (firstChild.prelim + modifierSumRight)
          if (totalGap > 0) {
            var subtreeAux: Tree<TData> | null = tree
            var numSubtrees = 0
            for (; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = subtreeAux.getLeftSibling()) {
              numSubtrees++
            }
            if (subtreeAux != null) {
              var subtreeMoveAux: Tree<TData> | null = tree
              var singleGap = totalGap / numSubtrees
              for (; subtreeMoveAux != leftAncestor; subtreeMoveAux = subtreeMoveAux?.getLeftSibling() || null) {
                if (subtreeMoveAux?.prelim && subtreeMoveAux?.modifier) {
                  subtreeMoveAux.prelim += totalGap
                  subtreeMoveAux.modifier += totalGap
                  totalGap -= singleGap
                }
              }
            }
          }
          j++
          if (firstChild.numChildren() == 0) {
            firstChild = getLeftMost(tree, 0, j)
          } else {
            firstChild = firstChild.getFirstChild()
          }
          if (firstChild != null) {
            firstChildLeftNeighbor = firstChild.leftNeighbor
          }
        }
      },
      /**
       * A postorder traversal of the tree. Each subtree is manipulated recursively from the bottom to top
       * and left to right, positioning the rigid units that form each subtree until none are touching each
       * other. Smaller subtrees are combined, forming larger subtrees until the root has been reached.
       * @param tree
       * @param level
       */
      firstWalk = function (tree: Tree<TData>, level: any) {
        var leftSibling = null
        tree.xPos = 0
        tree.yPos = 0
        tree.prelim = 0
        tree.modifier = 0
        tree.leftNeighbor = null
        tree.rightNeighbor = null
        setLevelHeight(tree, level)
        setLevelWidth(tree, level)
        setNeighbors(tree, level)
        if (tree.numChildren() === 0 || level == config.maxDepth) {
          leftSibling = tree.getLeftSibling()
          if (leftSibling !== null)
            tree.prelim = leftSibling.prelim + getNodeSize(leftSibling) + config.siblingSeparation
          else tree.prelim = 0
        } else {
          var n = tree.numChildren()
          for (var i = 0; i < n; i++) {
            const targetTree = tree.getChildAt(i)
            if (!targetTree) continue
            firstWalk(targetTree, level + 1)
          }
          var midPoint = tree.getChildrenCenter()
          midPoint -= getNodeSize(tree) / 2
          leftSibling = tree.getLeftSibling()
          if (leftSibling) {
            tree.prelim = leftSibling.prelim + getNodeSize(leftSibling) + config.siblingSeparation
            tree.modifier = tree.prelim - midPoint
            apportion(tree, level)
          } else {
            tree.prelim = midPoint
          }
        }
      },
      /**
       * A preorder traversal. Each node is given it's final X,Y coordinates by summing the preliminary
       * coordinate and the modifiers of all of its ancestor trees.
       * @param tree The tree that will be traversed.
       * @param level The vertical level of the tree.
       * @param X The X value of the tree.
       * @param Y The Y value of the tree.
       */
      secondWalk = function (tree: Tree<TData>, level: any, X: any, Y: any) {
        tree.xPos = rootXOffset + tree.prelim + X
        tree.yPos = rootYOffset + Y
        if (tree.numChildren()) {
          const targetTree = tree.getFirstChild()
          if (!targetTree) return
          secondWalk(targetTree, level + 1, X + tree.modifier, Y + maxLevelHeight[level] + config.levelSeparation)
        }
        var rightSibling = tree.getRightSibling()
        if (rightSibling) secondWalk(rightSibling, level, X, Y)
      },
      /**
       * Assign X,Y position values to the tree and it's descendants.
       * @param tree The tree to be positioned.
       */
      positionTree = function (tree: Tree<TData>) {
        maxLevelHeight = []
        maxLevelWidth = []
        previousLevelTree = []
        firstWalk(tree, 0)
        rootXOffset = config.topXAdjustment + tree.xPos
        rootYOffset = config.topYAdjustment + tree.yPos
        secondWalk(tree, 0, 0, 0)
        rootXOffset = Math.abs(getMinX(tree)) //Align to left
        secondWalk(tree, 0, 0, 0)
      },
      getMinX = function (tree: Tree<TData>) {
        // TODO: Check this, was TREE
        var nodes = tree.getNodeList(tree)
        var min = 0
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].xPos < min) min = nodes[i].xPos
        }
        return min
      },
      /**
       * Draw the tree and it's descendants on the canvass.
       * @param tree The tree that will be drawn.
       */
      drawNode = function (tree: Tree<TData>) {
        var x = tree.xPos,
          y = tree.yPos,
          width = tree.width,
          height = tree.height,
          text = tree.text,
          textWidth = context.measureText(text).width
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x, y + height)
        context.lineTo(x + width, y + height)
        context.lineTo(x + width, y)
        context.lineTo(x, y)
        context.lineWidth = 1
        context.fillStyle = tree.bgcolor
        context.fill()
        context.stroke()
        context.strokeStyle = tree.color
        context.textBaseline = 'middle'
        context.strokeText(text, x + width / 2 - textWidth / 2, y + height / 2, width)
        context.strokeStyle = 'black'
        if (tree.children.length > 0) {
          const firstChild = tree.getFirstChild()
          const lastChild = tree.getLastChild()
          if (!firstChild || !lastChild) return

          context.beginPath()
          context.moveTo(x + width / 2, y + height)
          context.lineTo(x + width / 2, y + height + config.levelSeparation / 2)
          context.moveTo(firstChild.xPos + firstChild.width / 2, y + height + config.levelSeparation / 2)
          context.lineTo(lastChild.xPos + lastChild.width / 2, y + height + config.levelSeparation / 2)
          context.stroke()
        }
        if (tree.parentId != -1) {
          context.beginPath()
          context.moveTo(x + width / 2, y)
          context.lineTo(x + width / 2, y - config.levelSeparation / 2)
          context.stroke()
        }
        for (var i = 0; tree.numChildren() > 0 && i < tree.numChildren(); i++) {
          const targetChild = tree.getChildAt(i)
          if (!targetChild) continue
          drawNode(targetChild)
        }
      }

    positionTree(tree)
    this.clear(context)
    drawNode(tree)
  }
}
