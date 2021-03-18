// import CETEI from 'CETEIcean'
// import { useState } from 'react';
// import ReactDOMServer from "react-dom/server";
// // var ReactDOMServer = require('react-dom/server');
// import { Parser as HtmlToReactParser } from 'html-to-react'
// // var HtmlToReactParser = require('html-to-react').Parser;



// const TestPage = () => {
//     const [tei, setTei] = useState({ data: null, ready: false })
//     var htmlInput = '<div><h1>Title</h1><p>A paragraph</p></div>';
//     var htmlToReactParser = new HtmlToReactParser();
//     var reactElement = htmlToReactParser.parse(htmlInput);
//     var reactHtml = ReactDOMServer.renderToStaticMarkup(reactElement);

//     if (!tei.ready) {
//         const CETEIcean = new CETEI()
//         CETEIcean.getHTML5('./b.xml', (data) => {
//             setTei({ data: data, ready: true })
//             console.log(tei.data)
//         })
//     }

//     return (
//         <>
//             { tei.ready ? tei.data : <h2>Loading</h2>}
//         </>
//     )
// }

// export default TestPage