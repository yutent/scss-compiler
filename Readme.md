# scss-compiler
> 可用于对scss文件进行简单的编译/压缩, 而不用安装各种前端工程化工具(webpack等)。

## 出现的契机
> 对于小项目来说, webpack等各种工程化工具, 实在过于重, 配置又繁琐。 而且还要安装一大堆模块。
> 有时候,我们只想简单的使用scss带来的便捷而已。所以本着这个目的, 我自己写了一个Sublime的插件, 可以在scss文件保存的时候, 自动编译成css文件(存于当前目录)。


## 兼容性
> 理论上, 兼容Linux/MacOS/Windows, 不过我只在Linux下测试过, 其他的系统, 请自行测试,有什么问题, 可以提issue。

## 依赖
> 既然是scss编译的, 当然就依赖于scss模块。
> scss模块, 可以使用js版的, 也可以使用ruby版的。

```bash
# 这是js版的, 可以使用npm来安装
sudo npm i node-sass -g

# 这是ruby版的, 可以使用 gem来安装
sudo gem install sass
```


## 插件安装
> 目前只能通过下载方式, 复制到sublime的插件目录,进行安装使用。
> 复制完之后,目录结构应该如下所示

```
 - subime-text-3/
   - Packages/
     - scss-compiler/
     - 其他插件等/
```
