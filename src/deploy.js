#!/usr/bin/env node

import shell from 'shelljs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { isValidProject } from './utils.js';

export async function deploy() {
  if (!isValidProject()) {
    console.log(chalk.red("当前目录不是一个有效的项目"));
    return;
  }

  console.log(chalk.blue('请确保已全局安装surge, npm install -g surge'));
  // 清理旧有文件
  console.log(chalk.blue('开始构建'));
  shell.rm('-rf', 'dist');
  // 调用build命令，并且不要打印任何输出
  shell.exec('npm run build');
  const { dist } = await inquirer.prompt({
    type: 'input',
    name: 'dist',
    default: shell.pwd() + '/dist',
    message: '请确认部署目录',
  });
  // spinner.succeed(chalk.green('构建成功'));
  // 询问域名
  const { domain } = await inquirer.prompt({
    type: 'input',
    name: 'domain',
    default: 'xwchris.surge.sh',
    message: '请确认部署域名',
  });
  // 使用shelljs调用surge部署,surge命令来自当前目录的node_modules/.bin/surge
  shell.exec(`surge ${dist} --domain ${domain}`);

  // 询问是否打开浏览器
  const { isOpen } = await inquirer.prompt({
    type: 'confirm',
    name: 'isOpen',
    default: true,
    message: '是否打开浏览器？',
  });

  if (!isOpen) {
    return;
  }
  // 打开浏览器
  shell.exec(`open https://${domain}`);
}