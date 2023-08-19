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

// [v.2] would be Freact.render()
function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";

  // [v.2] adding the appropiate props values of the node
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));

  element.props.children.forEach((child) => {
    // [v.2] as this are child elements their container are it's parents, that is why dom is passed as a parameter, as it is the parent element.
    render(child, dom);
  });
  container.appendChild(dom);
}

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
