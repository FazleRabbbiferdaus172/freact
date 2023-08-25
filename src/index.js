// [v.5] will be adding methods for updating dom

// [v.3] optimizaation of frecat.render recurssion as it will block main thread until render ends.
let nextUnitOfWork = null;

// [v.4] commiting the dom to root
function commitRoot() {
  // adding nodes to root
  deletions.forEach(commitWork)
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;  
}



function updateDom(dom, prevProps, nextProps) {
  // update the props
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom;
  if (fiber.effectTag == "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  }
  else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props,
    );
  }
  else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {

  // step 1: add a dom node
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }

  // [v.4] refactor adding to dom as there might be interruption before dom is fully renderd and result in and incomplete state which is not desireable.
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // create new fibers
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // return next unit of work

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: fiber,
    //   dom: null,
    // };

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      // Update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    
    if (element && !sameType) {
      // add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }

    if (oldFiber && !sameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    } 

    if (oldFiber) {
      oldFiber - oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    }
    else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork  = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // this call ensures that the workloop will be called again when the main thread is idle
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// [v.2] would be Freact.createElement(), returns just a object as expected from react.createElement. also createTextElement is implemented for the childen those are primitive type
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// [v.3] optimizezed render function with fiber tree datastructure, each node of fiber tree has link to it first child, parent and sibling. 
function createDOM(fiber, container) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";

  // [v.2] adding the appropiate props values of the node
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = fiber.props[name]));

  return dom;
}

// [v.2] would be Freact.render()
// [V.3] optimization with fiber tree datastructure
// [v.4] keeping track of root
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let wipRoot = null;
let currentRoot = null;
let deletions = null;

const Freact = {
  createElement,
  render,
};

// End of Freact library

// [v.1] React.createElement creates an object from its arguments. Besides some validations, that’s all it does. So we will replace the function call with its output
// [v.2] Now replacing v.1 version of js to calling Freact.createElement() with jsx

/** @jsx Freact.createElement */
const element = (
  <div id="freact">
    <h1>Hello Freact</h1>
    <h2 />
  </div>
);

////////////// React.createElement replaced

const container = document.getElementById("app");

// [v.1] Now we replace ReactDOM.render() function
// [v.2] Now calling Freact.render instead of ReactDOM.render

// const node = document.createElement(element.type);
// node["title"] = element.props.title;
// const children = document.createTextNode("");
// children["nodeValue"] = element.props.children;
// node.appendChild(children);
// container.appendChild(node);
Freact.render(element, container);

////////////// ReactDOM.render() replaced
