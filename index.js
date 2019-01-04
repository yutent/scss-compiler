/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2018/11/01 09:37:55
 */

'use strict'

const vsc = require('vscode')
const path = require('path')

const fs = require('iofs')
const ScssLib = require('./lib/index.js')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
let prefixer

const log = console.log

const render = function(style, file) {
  return new Promise((resolve, reject) => {
    ScssLib(file, { style: ScssLib.Sass.style[style] }, res => {
      if (res && res.text) {
        resolve(res.text)
      } else {
        reject(res)
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
        vsc.window.showInformationMessage(err)
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

function __init__() {
  let conf = vsc.workspace.getConfiguration('Scss2css')
  Object.assign(options, conf)

  options.output = options.output.split('|').map(it => it.trim())
}

function activate(ctx) {
  let folders = vsc.workspace.workspaceFolders
  let wsf = ''
  let browsersrc = ''
  if (folders && folders.length) {
    wsf = folders[0].uri.path
  }
  if (wsf) {
    browsersrc = path.join(wsf, '.browserslistrc')
  } else {
    let editor = vsc.window.activeTextEditor
    if (editor) {
      wsf = path.dirname(editor.document.fileName)
      browsersrc = path.join(wsf, '.browserslistrc')
    }
  }

  if (fs.exists(browsersrc)) {
    options.browsers = fs
      .cat(browsersrc)
      .toString()
      .split(/[\n\r]/)
  }
  prefixer = postcss().use(
    autoprefixer({
      browsers: options.browsers
    })
  )

  __init__()

  vsc.workspace.onDidChangeConfiguration(__init__)

  vsc.workspace.onDidSaveTextDocument(doc => {
    Compiler.filter(doc)
  })

  let cmd = vsc.commands.registerCommand('Scss2css.compile', _ => {
    let editor = vsc.window.activeTextEditor

    if (editor) {
      Compiler.compile(editor.document)
    }
  })
  ctx.subscriptions.push(cmd)
}

function deactivate() {}

exports.activate = activate
exports.deactivate = deactivate
