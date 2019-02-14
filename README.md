# scss-to-css
> The easiest way to compile scss file to css without using other tools like `webpack`. And autoprefixer at the same time.

[![Version](https://vsmarketplacebadge.apphb.com/version-short/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/yutent.scss-to-css.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.scss-to-css)
[![Build Status](https://travis-ci.org/yutent/scss-to-css.svg?branch=master)](https://travis-ci.org/yutent/scss-to-css)


[README_中文](./README_ZH.md)


Live demo:
![demo](./demo.gif)

## Why Scss-to-css
> For some small project or teaching speech. It's too fat to deploy a webpack env.
> Now, `scss-to-css` help us to compile scss file to css file at a none webpack project and autoprefixer.


## Configuration
> Some configuration can be set, which it works better for you。
>> - `compileOnSave`: Auto compile on document saved, default `true`
>> - `autoPrefixer`: Will autoprefixer. It can be run faster when turn off. default `true`
>> - `output`: Output style. default `compressed`。 
>> - `exclude`: The RegExp of path what you can to ignore(the `var.scss file` will never be compiled)。


## Issues
> This extension work well on all os. If any problem please let me known [issue](https://github.com/yutent/scss-to-css/issues)

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