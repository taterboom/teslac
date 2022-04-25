# 腾讯云函数每日电量提醒

设置定时触发器（如每天 23 点），查询一边电量，低于一定数值（如 150km）则会发邮件提醒

## Usage

1. 创建腾讯云函数
2. copy 代码
3. 设置环境变量
4. 设置每日定时触发器

## 环境变量

| 变量名              | 介绍                             |
| ------------------- | -------------------------------- |
| TESLA_ACCESS_TOKEN  | 特斯拉 access_token              |
| TESLA_REFRESH_TOKEN | 特斯拉 refresh_token             |
| SENDER              | 邮件发送者邮箱地址               |
| SENDER_PASS         | 邮件发送者邮箱地址的 SMTP 授权码 |
| RECEIVER            | 邮件介绍者邮箱地址               |
