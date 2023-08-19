const element = React.createElement(
    "h1",
    {
        title: "freact"
    },
    "Hello Freact"
)
const container = document.getElementById("app")
ReactDOM.render(element, container)