#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import ora from 'ora';
import degit from 'degit';
import { createGit } from './create-git.js';

export async function create(token, name) {
  // 请用户输入项目名字
  // 有name时则不需要再次输入
  let projectName;
  if (name) {
    projectName = name;
  } else {
    const { projectName: _projectName } = await inquirer.prompt({
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称（英文）',
    });
    projectName = _projectName;
  }
  // 通过github api创建一个远程仓库
  const { createRemote } = await inquirer.prompt({
    type: 'confirm',
    name: 'createRemote',
    message: '是否创建远程仓库',
  });

  const spinner = ora('正在创建项目...').start();

  await degit('xwchris/reactjs-vite-tailwindcss-boilerplate#main').clone(projectName);
  // shell.exec(`npx degit suren-atoyan/react-pwa#master ${projectName}`);
  shell.cd(projectName);
  // 安装依赖

  spinner.succeed(chalk.green('项目创建成功'));

  if (createRemote) {
    await createGit(token, projectName);
  }

  // 安装依赖
  const installSpinner = ora('正在安装依赖...').start();
  shell.exec('yarn');
  installSpinner.succeed(chalk.green('依赖安装成功'));
  console.log(chalk.green('项目创建成功，请输入以下命令开始开发'));
  console.log(chalk.green(`cd ${projectName}`));
}