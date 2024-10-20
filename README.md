# **Quizzible**

Quizzible is a Bible Quizzing app designed to help users study and practice Bible verses in an interactive and engaging way. The app allows users to select known chapters and verses, take quizzes, track their progress, and view their performance on a leaderboard.

## **Table of Contents**

* Architecture  
  * Overview  
  * Technologies Used  
  * Project Structure  
* Installation  
  * Prerequisites  
  * Installing Node.js and npm  
  * Cloning the Repository  
* Development Workflow  
  * Getting Started  
  * Creating a New Branch with GitHub Desktop  
  * Making Changes  
  * Submitting a Pull Request with GitHub Desktop  
* Deployment  
  * Building the App  
  * Deploying to GitHub Pages  
* Contributing  
* License

---

## **Architecture**

### **Overview**

Quizzible is a single-page application (SPA) built with React and Material-UI. It leverages TypeScript for type safety and code reliability. The app follows a component-based architecture, making it modular and scalable.

### **Technologies Used**

* **React**: A JavaScript library for building user interfaces.  
* **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.  
* **Material-UI**: A popular React UI framework that implements Google's Material Design.  
* **Webpack**: A module bundler used to compile JavaScript modules.  
* **Babel**: A JavaScript compiler that converts modern JavaScript into a backward-compatible version.

### **Project Structure**

The project's file and folder structure is organized as follows:

   ```

`├── public/                   # Public assets and HTML file`  
`├── src/                      # Source code`  
`│   ├── components/           # Reusable React components`  
`│   │   ├── SelectProfile.tsx`  
`│   │   ├── ChapterVerseSelection.tsx`  
`│   │   ├── Quiz.tsx`  
`│   │   ├── Leaderboard.tsx`  
`│   │   └── ...               # Other components`  
`│   ├── types/                # TypeScript type definitions`  
`│   │   └── index.ts          # Shared type definitions`  
`│   ├── utils/                # Utility functions`  
`│   │   ├── index.ts          # Utility functions`  
`│   │   └── ...               # Other utility files`  
`│   ├── App.tsx               # Main app component`  
`│   ├── index.tsx             # Entry point for React`  
`│   ├── theme.ts              # Material-UI theme customization`  
`│   └── ...                   # Other files`  
`├── docs/                     # Deployment directory for GitHub Pages`  
`├── package.json              # Project dependencies and scripts`  
`├── tsconfig.json             # TypeScript configuration`  
`├── webpack.config.js         # Webpack configuration`  
`└── README.md                 # Project documentation`

   ```
---

## **Installation**

### **Prerequisites**

Before setting up the project, ensure you have the following installed on your system:

* **Node.js and npm**: Node.js is a JavaScript runtime, and npm is the Node.js package manager. npm comes bundled with Node.js.  
* **GitHub Desktop**: A GUI application that allows you to interact with GitHub repositories without using the command line.

### **Installing Node.js and npm**

1. **Download Node.js**  
   * Visit the [official Node.js website](https://nodejs.org/) and download the latest LTS (Long Term Support) version for your operating system.  
2. **Install Node.js**  
   * Run the downloaded installer and follow the installation prompts.  
   * Ensure that the option to install npm is selected during the installation process.  
3. **Verify Installation**  
   * Open a terminal or command prompt.  
   * Check the installed versions:  

   ```
   `node -v`  
   `npm -v`
   ```

   * You should see the installed versions of Node.js and npm.

### **Cloning the Repository**

1. **Install GitHub Desktop**  
   * Download GitHub Desktop from the [official website](https://desktop.github.com/).  
   * Install the application by following the installation prompts.  
2. **Clone the Repository Using GitHub Desktop**  
   * Open GitHub Desktop.  
   * Go to **File \> Clone Repository**.  
   * In the **URL** tab, enter the repository URL:  
     `https://github.com/your-username/quizzible.git`  
   * Replace `your-username` with your GitHub username.  
   * Choose a local path where you want to clone the repository.  
   * Click **Clone**.

---

## **Development Workflow**

### **Getting Started**

1. **Open the Project in Your Code Editor**  
   * Navigate to the cloned repository folder on your computer.  
   * Open the project in your preferred code editor (e.g., Visual Studio Code).  
2. **Install Dependencies**  
   * Open a terminal or command prompt in the project directory.  
   * Run the following command to install the project dependencies:  
   ```
     `npm install`  
   ```
3. **Start the Development Server**  
   * Run the app locally by executing:  
   ```
     `npm start`  
   ```
   * The app should now be running at `http://localhost:3000`.

### **Creating a New Branch with GitHub Desktop**

When making changes or adding new features, it's important to work on a separate branch to keep the `main` branch stable.

1. **Create a New Branch**  
   * In GitHub Desktop, make sure the repository is selected.  
   * Click on the **Current Branch** dropdown at the top.  
   * Click **New Branch**.  
   * Enter a descriptive name for your branch, e.g., `feature/your-feature-name`.  
   * Click **Create Branch**.  
2. **Switch to the New Branch**  
   * GitHub Desktop will automatically switch to your new branch.  
   * Confirm that your branch name is displayed in the **Current Branch** dropdown.

### **Making Changes**

1. **Implement Your Changes**  
   * Edit the source code in the `src/` directory.  
   * Follow the project's coding standards and guidelines.  
2. **Test Your Changes**  
   * Ensure that your changes do not break existing functionality.  
   * Test the app in the browser and check for any errors or warnings.  
3. **Commit Your Changes with GitHub Desktop**  
   * In GitHub Desktop, you will see a list of changed files in the **Changes** tab.  
   * Review the changes to ensure everything is correct.  
   * At the bottom left, enter a **Summary** for your commit, e.g., "Add feature: your feature description".  
   * Optionally, add a **Description** with more details.  
   * Click **Commit to feature/your-feature-name**.

### **Submitting a Pull Request with GitHub Desktop**

1. **Push Your Branch to GitHub**  
   * In GitHub Desktop, click **Publish branch** (if it's the first time pushing this branch).  
   * This will push your branch to the remote repository on GitHub.  
2. **Create a Pull Request**  
   * After pushing, GitHub Desktop will show a prompt: "Create Pull Request".  
   * Click **Create Pull Request**.  
   * This will open your web browser to the GitHub website.  
   * On GitHub, provide a clear description of your changes.  
   * Click **Create Pull Request**.  
3. **Code Review and Merge**  
   * Wait for feedback or approval from the maintainers.  
   * Address any requested changes.  
   * Once approved, the pull request can be merged into the `main` branch by a maintainer.

---

## **Deployment**

Quizzible is deployed using GitHub Pages. The deployment process involves building the app and committing the generated files to the `docs` directory, which GitHub Pages serves as a static site.

### **Building the App**

1. **Build the Production Bundle**  
   * Open a terminal or command prompt in the project directory.  
   * Run the following command to generate the production build:  
   ```
     `npm run build`  
   ```
   * This command generates optimized production files in the `build` directory.

### **Deploying to GitHub Pages**

1. **Run the Deploy Script**  
   * Run the deploy script by executing:  
   ```
     `npm run deploy`  
   ```
   * The `deploy` script should be configured in `package.json` to:  
     * Build the app.  
     * Copy the contents of the `build` directory into the `docs` directory.  
     * Ensure the correct base path is set for GitHub Pages.  
2. **Commit and Push the `docs` Directory Using GitHub Desktop**  
   * In GitHub Desktop, you will see changes in the **Changes** tab related to the `docs` directory.  
   * Review the changes to ensure they are correct.  
   * Enter a commit message, e.g., "Deploy to GitHub Pages".  
   * Click **Commit to main**.  
   * Click **Push origin** to push your changes to the remote repository.  
3. **Verify Deployment**  
   * Visit `https://your-username.github.io/quizzible` to see the live app.  
   * Ensure that all features are working as expected.

---

## **Contributing**

We welcome contributions to Quizzible\! To contribute:

* **Fork the Repository**  
  * Go to the repository page on GitHub.  
  * Click on the **Fork** button at the top right to create your own copy of the repository.  
* **Clone Your Fork Using GitHub Desktop**  
  * In GitHub Desktop, go to **File \> Clone Repository**.  
  * In the **GitHub.com** tab, select your fork of the repository.  
  * Choose a local path and click **Clone**.  
* **Create a Feature Branch**  
  * Follow the instructions in the Creating a New Branch with GitHub Desktop section.  
* **Make Changes and Submit a Pull Request**  
  * Implement your changes and commit them using GitHub Desktop.  
  * Push your branch to your forked repository.  
  * Go to your fork on GitHub and create a pull request to the original repository's `main` branch.

Please make sure to follow the project's coding standards and include appropriate documentation and tests with your contributions.

---

## **License**

Quizzible is released under the MIT License.

---

**Note**:

* Replace placeholders like `your-username` and `your-feature-name` with your actual GitHub username and feature names when following the instructions.  
* If you're new to Git and GitHub, you can find additional resources and tutorials on the [GitHub Guides](https://guides.github.com/) website.

---

Feel free to reach out if you have any questions or need assistance with the development or deployment process.

