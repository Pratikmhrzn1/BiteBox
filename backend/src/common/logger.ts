import chalk from 'chalk'
type LogType = 'info' | 'success' | 'error';
function log(type:LogType, message: string) {
    const time = new Date().toLocaleTimeString();
    switch (type) {
        case 'info':
            console.info(chalk.blue(`[${time}] ${message}`));
            break;
        case 'success':
            console.log(chalk.green(`[${time}] ${message}`));
            break;
        case 'error':
            console.error(chalk.red(`[${time}] ${message}`));
            break;
    }
}