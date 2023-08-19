// React.createElement creates an object from its arguments. Besides some validations, that’s all it does. So we will replace the function call with its output 
const element = {
    type: "h1",
    props: {
        title: "freact",
        children: "Hello Freact",
    },
};
////////////// React.createelement replaced

const container = document.getElementById("app");

// Now we replace ReactDOM.render() function
const node = document.createElement(element.type);
node["title"] = element.props.title;
const children = document.createTextNode("");
children["nodeValue"] = element.props.children;
node.appendChild(children);
container.appendChild(node);
////////////// ReactDOM.render() replaced
