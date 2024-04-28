#!/usr/bin/env node

import { Octokit } from '@octokit/core'
import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import ora from 'ora';
import degit from 'degit';

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
      message: '请输入项目名称',
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

  await degit('suren-atoyan/react-pwa#master').clone(projectName);
  // shell.exec(`npx degit suren-atoyan/react-pwa#master ${projectName}`);
  shell.cd(projectName);
  // 安装依赖

  spinner.succeed(chalk.green('项目创建成功'));

  if (createRemote) {
    const spinner = ora('正在创建远程仓库...').start();

    // 使用github openapi创建
    const octokit = new Octokit({
      auth: token,
    });

    const response = await octokit.request('POST /user/repos', {
      name: projectName
    });

    // 获取仓库地址
    const repoUrl = response.data.ssh_url;
    spinner.succeed(chalk.green('远程仓库创建成功，地址为：' + repoUrl + '，正在推送代码...'));

    // 本地git init并推送到远程仓库
    shell.exec('git init');
    shell.exec('git add .');
    shell.exec('git commit -m "init"');
    shell.exec(`git remote add origin ${repoUrl}`);
    shell.exec('git push -u origin master');
    // shell结束
    shell.exec('exit')
  }

  // 安装依赖
  const installSpinner = ora('正在安装依赖...').start();
  shell.exec('yarn');
  installSpinner.succeed(chalk.green('依赖安装成功'));
}