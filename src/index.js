#!/usr/bin/env node

import shell from "shelljs";
import { create } from "./create.js";
import { deploy } from "./deploy.js";
import { push } from "./push.js";
import { init } from "./init.js";

(function () {
  const command = process.argv[2];
  const projectName = process.argv[3];

  const token = shell.exec("echo $MY_GITHUB_TOKEN", { silent: true }).stdout.trim();

  if (!token && command !== "init") {
    init(token)
  }

  switch (command) {
    case "init":
      init(token);
      break;
    case "create":
      create(token, projectName);
      break;
    case "deploy":
      deploy();
      break;
    case "push":
      push();
      break;
    default:
      // 无效命令时输出帮助信息
      console.log("Usage: ");
      console.log("  init                   set github token");
      console.log("  create <project-name>  create a new project");
      console.log("  deploy                 deploy the project");
      console.log("  push                   push the project");
      break;
  }
})();
// (function () {
//   create();
// }())
