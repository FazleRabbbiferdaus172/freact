// would be Freact.createElement(), returns just a object as expected from react.createElement
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

const Freact = {
  createElement,
};

// v.1 React.createElement creates an object from its arguments. Besides some validations, that’s all it does. So we will replace the function call with its output
// Now replacing v.1 version of js to calling Freact.createElement() with jsx

/** @jsx Didact.createElement */
const element = (
  <div id="freact">
    <h1>Hello Freact</h1>
    <h2 />
  </div>
);

////////////// React.createElement replaced

const container = document.getElementById("app");

// Now we replace ReactDOM.render() function
const node = document.createElement(element.type);
node["title"] = element.props.title;
const children = document.createTextNode("");
children["nodeValue"] = element.props.children;
node.appendChild(children);
container.appendChild(node);
////////////// ReactDOM.render() replaced
