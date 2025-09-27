
import { Folder } from '../types';

export const initialFileSystem: Folder = {
  id: 'root',
  name: 'Code-Gemini-Project',
  type: 'folder',
  parentId: null,
  children: [
    {
      id: '1',
      name: 'public',
      type: 'folder',
      parentId: 'root',
      children: [
        {
          id: '2',
          name: 'index.html',
          type: 'file',
          parentId: '1',
          content: `<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <h1>Welcome to My App</h1>
    <div id="root"></div>
    <script src="../src/index.js"></script>
  </body>
</html>`,
        },
      ],
    },
    {
      id: '3',
      name: 'src',
      type: 'folder',
      parentId: 'root',
      children: [
        {
          id: '4',
          name: 'index.js',
          type: 'file',
          parentId: '3',
          content: 'import React from "react";\nimport ReactDOM from "react-dom";\n\nconst App = () => <h1>Hello, World!</h1>;\n\nReactDOM.render(<App />, document.getElementById("root"));\n',
        },
        {
          id: '5',
          name: 'components',
          type: 'folder',
          parentId: '3',
          children: [],
        },
      ],
    },
    {
      id: '6',
      name: 'package.json',
      type: 'file',
      parentId: 'root',
      content: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`,
    },
  ],
};
