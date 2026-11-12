---
title: 安裝部署
description: 快速部署 BeaComm 伺服器並投入使用的極簡教學。
---

BeaComm（Beacon + Communication）是一款輕量、開箱即用的私有化聊天伺服器軟體，單一指令即可完成部署並投入使用。

## 部署伺服器軟體包

登入伺服器，開啟終端機，執行以下指令：

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/GeneralIM-HK/BeaComm-install/HEAD/install.sh)"
```

## 取得伺服器接入位址

安裝完成後，終端機將輸出供用戶端登入的伺服器接入位址，格式如下：

```
http://123.123.123.123
```

如果您自行指定了連接埠，則在輸入網址時需要寫明連接埠號：

```
http://123.123.123.123:<your-port-number>
```

## 取得用戶端

前往官網首頁的「[下載用戶端](/zh-tw/#download)」區塊，取得對應平台的行動 App 或桌面用戶端。

## 登入伺服器

1. 啟動用戶端，在「伺服器位址」填入上一步取得的接入位址。
2. 輸入電子郵件與密碼，完成註冊或登入。
