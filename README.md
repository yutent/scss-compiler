# scss-to-css
> 可用于对scss文件进行简单的编译/压缩, 而不用安装各种前端工程化工具(webpack等)。

[![Version](https://vsmarketplacebadge.apphb.com/version-short/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Build Status](https://travis-ci.org/yutent/scss-to-css.svg?branch=master)](https://travis-ci.org/yutent/scss-to-css)


## 出现的契机
> 对于小项目来说, webpack等各种工程化工具, 实在过于重, 配置又繁琐。 而且还要安装一大堆模块。
> 有时候,我们只想简单的使用scss带来的便捷而已。所以本着这个目的, 我自己写了一个vsc的插件, 可以在scss文件保存的时候, 自动编译成css文件(存于当前目录),并且自动补全浏览器前缀。


## 兼容性
> 理论上, 兼容Linux/MacOS/Windows, 不过我只在Linux/MacOS下测试过, 用Windows的童鞋请自行测试,有什么问题, 可以提issue。

## 安装
> 直接在商店搜索安装即可。


## .browserslistrc 范例

```
ie > 9
iOS > 8
Android >= 4.4
ff > 38
Chrome > 38
```
