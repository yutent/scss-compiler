/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2018/11/01 09:37:55
 */

'use strict'

const vsc = require('vscode')
const path = require('path')
const cp = require('child_process')

const scss = require('node-sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const std = vsc.window.createOutputChannel('scss-to-css')
std.out = function() {
  std.appendLine(msg)
}
const log = function(...args) {
  console.log.apply(console, args)
}

let compileOpts = {
  compileOnSave: true,
  autoPrefixer: true,
  output: 'compressed',
  sourcemap: false,
  exclude: ''
}

const exec = function(arr, cb) {
  let cmd = arr.join(' ')
  return new Promise((yes, no) => {
    cp.exec(cmd, (err, out) => {
      if (err) {
        no('err: ' + err)
      } else {
        yes(arr)
      }
    })
  })
}

const Compiler = {
  compile(doc) {
    let origin = doc.fileName || ''
    let target = origin.replace(/\.scss$/, '.')
    let task = []
    let postArgs = ['postcss', '--no-map', '-r', '-u', 'autoprefixer']

    // 说明不是scss文件
    if (origin === target) {
      return
    }

    task = compileOpts.output.map(type => {
      let cmd = ['scss', '-C', '-t', type]
      let ext = 'css'

      if (compileOpts.sourcemap) {
        cmd.push('--sourcemap=auto')
      } else {
        cmd.push('--sourcemap=none')
      }
      switch (type) {
        case 'compressed':
          ext = 'min.' + ext
          break
        default:
          ext = type.slice(0, 1) + '.' + ext
      }

      cmd.push(origin, target + ext)
      return cmd
    })

    // 编译单一类型, 则去掉文件名微调
    if (task.length === 1) {
      task[0].pop()
      task[0].push(target + 'css')
    }

    task = task.map(item => {
      return exec(item)
    })

    Promise.all(task)
      .then(list => {
        if (compileOpts.autoPrefixer) {
          let task2 = list.map(cmd => {
            let arr = postArgs.concat()
            arr.splice(1, 0, cmd.pop())
            return exec(arr)
          })

          return Promise.all(task2)
        } else {
          return true
        }
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
    log(doc)
    // 未开启保存时编译
    if (!compileOpts.compileOnSave) {
      return
    }

    let origin = doc.fileName || ''

    // var.scss文件默认不编译
    if (/\/var\.scss$/.test(origin)) {
      return
    }

    // 过滤不编译的文件
    if (compileOpts.exclude) {
      let exp = new RegExp(compileOpts.exclude, 'i')
      if (exp.test(origin)) {
        return
      }
    }

    this.compile(doc)
  }
}

function activate(ctx) {
  // log('hello, the extend scss-compiler is running....')
  let options = vsc.workspace.getConfiguration('ScssCompiler')
  Object.assign(compileOpts, options)

  compileOpts.output = compileOpts.output.split('|')

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
