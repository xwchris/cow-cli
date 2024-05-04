import ora from "ora";
import { Octokit } from '@octokit/core'
import chalk from "chalk";
import shell from "shelljs";
import { isValidProject, isValidGitProject } from "./utils.js";
import inquirer from "inquirer";
import path from "path";

export async function createGit(token, projectName) {
  if (!isValidProject()) {
    console.log(chalk.red("当前目录不是一个有效的项目，请确保当前目录有package.json文件"));
    return;
  }

  if (isValidGitProject()) {
    console.log(chalk.red("当前项目已经是一个git项目"));
    return;
  }

  if (!projectName) {
    // 获取当前目录名作为项目名
    const currentPath = process.cwd();
    const defaultProjectName = path.basename(currentPath);

    const { projectName: _projectName } = await inquirer.prompt({
      type: 'input',
      name: 'projectName',
      default: defaultProjectName,
      message: '请输入git项目名称（英文）',
    });
    projectName = _projectName;
  }

  // 询问创建私有仓库还是公有仓库
  const { isPublic } = await inquirer.prompt({
    type: 'confirm',
    name: 'isPublic',
    default: true,
    message: '是否创建公开仓库',
  });

  const spinner = ora('正在创建远程仓库...').start();

  // 使用github openapi创建
  const octokit = new Octokit({
    auth: token,
  });

  const response = await octokit.request('POST /user/repos', {
    name: projectName,
    private: !isPublic,
  });

  // 获取仓库地址
  const repoUrl = response.data.ssh_url;
  spinner.succeed(chalk.green('远程仓库创建成功，地址为：' + repoUrl + '，正在推送代码...'));

  // 本地git init并推送到远程仓库
  shell.exec('git config --global init.defaultBranch main')
  shell.exec('git init');
  shell.exec('git add .');
  shell.exec('git commit -m "init"');
  shell.exec(`git remote add origin ${repoUrl}`);
  shell.exec('git push -u origin main && exit');
}