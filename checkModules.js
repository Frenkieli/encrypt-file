const fs = require("fs");
const requiredModules = ["crypto-js", "progress"]; // 请根据需要调整模块名称
const packageJsonContent = {
  name: "encryptfile",
  version: "1.0.0",
  description: "",
  main: "node.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  author: "",
  license: "ISC",
  dependencies: {
    "crypto-js": "^4.2.0",
    progress: "^2.0.3", // 注意这里我假设您指的是 'progress' 而不是 'encryptScript'
  },
};

function checkModules() {
  let allModulesInstalled = true;

  requiredModules.forEach((module) => {
    try {
      require(module);
    } catch (e) {
      console.error(`Module "${module}" is not installed.`);
      allModulesInstalled = false;
    }
  });

  if (!allModulesInstalled) {
    console.log("Creating package.json for missing modules...");
    fs.writeFileSync(
      "package.json",
      JSON.stringify(packageJsonContent, null, 2)
    );
    console.log("package.json has been created.");
    console.log('Please run "npm install" to install the missing modules.');
    process.exit(1);
  } else {
    console.log("All required modules are installed.");
  }
}

try {
  checkModules();
} catch (error) {
  console.error(error);
  process.exit(1);
}
