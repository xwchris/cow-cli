import chalk from "chalk";
import inquirer from "inquirer";
import shell from "shelljs";

export async function init() {
  // 从shell环境变量中获取github token
  const token = shell.exec("echo $MY_GITHUB_TOKEN", { silent: true }).stdout.trim();
  // 如果没有token则提示用户输入
  if (token) {
    console.log(chalk.green("Github Token: " + token));
    return;
  }
  console.log(chalk.yellow("未设置github token，请从 https://github.com/settings/tokens 获取"));

  // 自动判断bash类型
  const shellType = process.env.SHELL;

  // 询问输入token
  const { githubToken } = await inquirer.prompt({
    type: "input",
    name: "githubToken",
    message: "请输入github token",
  });

  const shellConfigPath = shellType === "/bin/zsh" ? "~/.zshrc" : "~/.bash_profile";
  // 写入到bash环境变量
  shell.exec(`echo "export MY_GITHUB_TOKEN=${githubToken}" >> ${shellConfigPath}`);
  // 重启shell
  shell.exec(`source ${shellConfigPath}`);
  console.log(chalk.green(`Token设置成功，放在${shellConfigPath}中`));
}