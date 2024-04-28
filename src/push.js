#!/usr/bin/env node
import inquirer from 'inquirer';
import shell from 'shelljs';
import chalk from 'chalk';
import { isValidGitProject, isValidProject } from './utils.js';

export async function push() {
  if (!isValidProject) {
    console.log(chalk.red("当前目录不是一个有效的项目，请确保当前目录有package.json文件"));
    return;
  }
  if (!isValidGitProject()) {
    console.log(chalk.red("当前目录不是一个有效的git项目，请在当前目录执行create-git命令创建一个git项目"));
    return;
  }

  // 输入提交信息
  const { message } = await inquirer.prompt({
    type: 'input',
    name: 'message',
    default: 'update',
    message: '请输入提交信息',
  });
  // 使用git命令添加并推送
  shell.exec(`git add .`);
  shell.exec(`git commit -m "${message}"`);
  shell.exec(`git push`);
}