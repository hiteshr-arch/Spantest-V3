Provide only the frontend. Backend is not needed. 

Use Vite 

Use React + TypeScript + SCSS for the frontend ant use 7-1 architecture for SCSS. 

The frontend app should be designed for scalability and high performance, and can support high user traffic. 

The code should follow the DRY principle (Do not repeat yourself), which means there is no duplication in the code. 

Include only the code that is actually used; no additional or unused code is required, and the same goes for the libraries. 

The code should not have the api calling logic; only use dummy data. Store all dummy data in a single file if used. 

Dependencies (libraries should be used):- 

typescript 

antd 

ant-design/icons 

React-router-dom 

Follow the given folder structure of the src folder:- 

src/ 

├── assets/   

│ 

├── components/ 

│   ├── layout/ 

│   └── ui/ 

│ 

├── lib/ 

│ 

├── hooks/ 

│ 

├── pages/ 

│ 

├── styles/ 

│   ├── abstracts/ 

│   │   ├── _colors.scss 

│   │   ├── _mixins.scss 

│   │   └── _variables.scss 

│   │ 

│   ├── base/ 

│   │   ├── _base.scss 

│   │   └── _typography.scss 

│   │ 

│   ├── components/ 

│   │ 

│   ├── layout/ 

│   │   ├── _footer.scss 

│   │   ├── _header.scss 

│   │   ├── _navbar.scss 

│   │   └── _sidebar.scss 

│   │ 

│   ├── themes/ 

│   │   ├── _dark-theme.scss 

│   │   └── _light-theme.scss 

│   │ 

│   └── main.scss 

│ 

├── App.scss 

├── App.tsx 

├── index.css 

├── routes.ts 

└── main.tsx 

 

Use BEM Naming Convention for writing class names. 

Provide developer usage guidelines and a README file to understand the code. 

And break the UI in components. 

 

 

 

 

 

 