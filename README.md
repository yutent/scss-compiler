# scss-to-css
> It can be used for simple compilation/compression of scss files without installing various front-end engineering tools (webpack, etc.).

[![Version](https://vsmarketplacebadge.apphb.com/version-short/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Build Status](https://travis-ci.org/yutent/scss-to-css.svg?branch=master)](https://travis-ci.org/yutent/scss-to-css)


[README_中文](./README_ZH.md)


Live demo:
![demo](./demo.gif)

## Why Scss-to-css
> For small projects, various engineering tools such as webpack are too heavy and cumbersome to configure. And a lot of modules have to be installed.
> Sometimes, we just want to simply use the convenience brought by scss. So for this purpose, I wrote a vsc plug-in, which can be automatically compiled into a css file (stored in the current directory by default) when the scss file is saved, and the browser prefix is ​​automatically completed.


## Configuration
> Some configuration can be set, which it works better for you。
>> - `compileOnSave`: Auto compile on document saved, default `true`
>> - `autoPrefixer`: Will autoprefixer. It can be run faster when turn off. default `true`
>> - `output`: Output style. default `compressed`。 
>> - `exclude`: The RegExp of path what you can to ignore(the `var.scss file` will never be compiled)。


## Issues
> This extension work well on all os. If any problem please let me known [issue](https://github.com/yutent/scss-to-css/issues)


## Dependencies
> We use `node-sass`(Deprecated in 3.1.0) instead of `libsass`.
>> v3.1.0 uses `sass` instead. No need to install node-sass globally

 - `node-sass`, You need to install this module manually. Maybe `root` is required on linux.


## Installation
> Search `scss-to-css` and install in the marketplace.


## .browserslistrc DEMO (Deprecated in 2.x)
> Just for demo, you can change it by youself. If not exists, the default value will be `last 2 version`.

```
ie > 9
iOS > 8
Android >= 4.4
ff > 38
Chrome > 38
```

## .scssrc DEMO (in 2.x or above)
> instead of using `.browserslistrc`, we recommend to use `.scssrc`.

```json
{
  "browsers": ["ie > 9", "iOS > 8", "Android >= 4.4", "ff > 38", "Chrome > 38"],
  "outdir": "dist" // relative path of this '.scssrc' file.
}

// You can also set other config in this file.
// eg. compileOnSave,autoPrefixer,output,exclude
```