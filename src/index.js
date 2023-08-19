// React.createElement creates an object from its arguments. Besides some validations, that’s all it does. So we will replace the function call with its output 
const element = {
    type: "h1",
    props: {
        title: "freact",
        children: "Hello Freact",
    },
};
const container = document.getElementById("app");
ReactDOM.render(element, container);