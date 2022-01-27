function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  const refNode =
    position === 0
      ? fatherNode.children[0]
      : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}

function multiRootComponentOnDragStart(evt) {
  const parent = evt.item.parentNode;
  const currentChildNodes = parent.childNodes;
  const newChildNodes = [];
  const childNodesHoldingGroups = [];

  for (let i = 0; i < currentChildNodes.length; i++) {
    const currentNode = currentChildNodes[i];

    // then we have a comment node that Vue doesn't wrap in empty text nodes in Multiroot components
    if (currentNode.nodeType === 8) {
      newChildNodes.push(currentNode);
      const childGroupObj = [];
      childNodesHoldingGroups.push(childGroupObj);

      continue;
    }

    // then we have a text node that is the beginning wrapper to the actual draggable element
    if (
      currentNode.nodeType === 3 &&
      currentNode.nextElementSibling &&
      currentNode.nextElementSibling.__draggable_context
    ) {
      const newParent = currentNode.nextElementSibling;

      newChildNodes.push(newParent);
      const childGroupObj = [currentNode, newParent.nextSibling];
      childNodesHoldingGroups.push(childGroupObj);

      // increment i 2x times since we also get the i++ in the for loop
      // as we should have just worked with 3 elements in a row.
      i = i + 2;
    }
  }

  for (let i = 0; i < newChildNodes.length; i++) {
    const currentNode = newChildNodes[i];

    // then we have a comment node that Vue doesn't wrap in empty text nodes in Multiroot components
    if (currentNode.nodeType === 8) continue;

    const newChildren = childNodesHoldingGroups[i];

    for (let j = 0; j < newChildren.length; j++) {
      newChildNodes[i].appendChild(newChildren[j]);
    }
  }
  parent.replaceChildren(...newChildNodes);
}

function multiRootComponentOnDragEnd(evt) {
  const parent = evt.item.parentNode;
  const currentChildNodes = parent.childNodes;
  const newChildNodes = [];

  for (let i = 0; i < currentChildNodes.length; i++) {
    // then we have a comment node that we'll just put right back where we found it
    if (currentChildNodes[i].nodeType === 8) {
      newChildNodes.push(currentChildNodes[i]);
      continue;
    }

    // convert the NodeList into an array so we can manipulate it
    const oldChildNodes = [].slice.call(currentChildNodes[i].childNodes);
    const textNodePrepend = oldChildNodes[oldChildNodes.length - 2];
    const textNodeAppend = oldChildNodes[oldChildNodes.length - 1];

    oldChildNodes.splice(oldChildNodes.length - 2, 2);
    currentChildNodes[i].replaceChildren(...oldChildNodes);

    newChildNodes.push(textNodePrepend);
    newChildNodes.push(currentChildNodes[i]);
    newChildNodes.push(textNodeAppend);
  }

  parent.replaceChildren(...newChildNodes);
}

const makeId = (length) => {
  var result = '';
  // eslint-disable-next-line prettier/prettier
  var characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    while (randomIndex > charactersLength) {
      var randomIndex = Math.floor(Math.random() * charactersLength);
    }
    console.log('randomIndex - ', randomIndex)
    console.log('characters[randomIndex] - ', characters[randomIndex])
    result += characters[randomIndex];
    if (randomIndex > -1) {
      characters.splice(randomIndex, 1);
    }
  }
  return result;
};

export {
  insertNodeAt,
  removeNode,
  multiRootComponentOnDragStart,
  multiRootComponentOnDragEnd,
  makeId
};
