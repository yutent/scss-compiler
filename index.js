/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2018/11/01 09:37:55
 */

'use strict'

const vsc = require('vscode')
const path = require('path')
const cp = require('child_process')

const fs = require('iofs')
const scss = require('node-sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const prefixer = postcss().use(autoprefixer())

const std = vsc.window.createOutputChannel('scss-to-css')
std.out = function() {
  std.appendLine(msg)
}
const log = function(...args) {
  console.log.apply(console, args)
}

const render = function(style, file) {
  return new Promise((resolve, reject) => {
    scss.render({ outputStyle: style, file }, (err, { css }) => {
      if (err) {
        reject(err)
      } else {
        resolve(css)
      }
    })
  })
}

let options = {
  compileOnSave: true,
  autoPrefixer: true,
  output: 'compressed',
  exclude: ''
}

// const exec = function(arr, cb) {
//   let cmd = arr.join(' ')
//   return new Promise((yes, no) => {
//     cp.exec(cmd, (err, out) => {
//       if (err) {
//         no('err: ' + err)
//       } else {
//         yes(arr)
//       }
//     })
//   })
// }

const compileCss = (style, entry, output) => {
  return render(style, entry).then(css => {
    if (options.autoPrefixer) {
      return prefixer.process(css, { from: '', to: '' }).then(result => {
        return { css: result.css, output }
      })
    } else {
      return { css, output }
    }
  })
}

const Compiler = {
  compile(doc) {
    let origin = doc.fileName || ''
    let target = origin.replace(/\.scss$/, '.')
    let task = []

    // 说明不是scss文件
    if (origin === target) {
      return
    }

    task = options.output.map(style => {
      let ext = 'css'

      switch (style) {
        case 'compressed':
          ext = 'min.' + ext
          break
        default:
          ext = style.slice(0, 1) + '.' + ext
      }

      return { style, output: target + ext }
    })

    // 编译单一类型, 则去掉文件名微调
    if (task.length === 1) {
      task[0].output = target + 'css'
    }

    task = task.map(item => {
      return compileCss(item.style, origin, item.output)
    })

    Promise.all(task)
      .then(list => {
        list.forEach(it => {
          fs.echo(it.css, it.output)
        })
      })
      .catch(err => {
        log(err)
      })
  },

  /**
   * 条件过滤
   * 用于保存时编译的动作, 右键编译时, 不过滤这2项
   */
  filter(doc) {
    // 未开启保存时编译
    if (!options.compileOnSave) {
      return
    }

    let origin = doc.fileName || ''

    // var.scss文件默认不编译
    if (/\/var\.scss$/.test(origin)) {
      return
    }

    // 过滤不编译的文件
    if (options.exclude) {
      let exp = new RegExp(options.exclude, 'i')
      if (exp.test(origin)) {
        return
      }
    }

    this.compile(doc)
  }
}

function activate(ctx) {
  // log('hello, the extend scss-compiler is running....')
  let conf = vsc.workspace.getConfiguration('Scss2css')
  Object.assign(options, conf)

  options.output = options.output.split('|').map(it => it.trim())

  vsc.workspace.onDidSaveTextDocument(doc => {
    Compiler.filter(doc)
  })
  // let cmd = vsc.commands.registerCommand('ScssCompiler.compile', function(r) {
  //   log('----------------------------====================-----------------')
  // })
  // ctx.subscriptions.push(cmd)
}

function deactivate() {}

exports.activate = activate
exports.deactivate = deactivate
