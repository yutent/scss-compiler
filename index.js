/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2018/11/01 09:37:55
 */

'use strict'

const vsc = require('vscode')
const path = require('path')

const exec = require('child_process').exec
const fs = require('iofs')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
let prefixer

const log = console.log
const std = vsc.window.createOutputChannel('scss-to-css')
std.out = function(msg) {
  std.appendLine(msg)
}

function run(cmd) {
  return new Promise((yes, no) => {
    exec(cmd, (err, res) => {
      if (err) {
        std.out(err)
        no(err)
      } else {
        yes(res)
      }
    })
  })
}

const render = function(style, file) {
  return run(`node-sass --output-style ${style} ${file}`)
}

let options = {
  compileOnSave: true,
  autoPrefixer: true,
  output: 'compressed',
  exclude: ''
}

const compileScss = (style, entry, output) => {
  if (options.outdir) {
    let tmp = output.replace(options.workspace, '.')
    output = path.join(options.outdir, tmp)
  }
  return render(style, entry)
    .then(css => {
      if (options.autoPrefixer) {
        return prefixer.process(css, { from: '', to: '' }).then(result => {
          return { css: result.css, output }
        })
      } else {
        return { css, output }
      }
    })
    .catch(err => {
      std.out(err)
    })
}

const Compiler = {
  compile(doc) {
    let origin = doc.fileName || ''
    let target = origin.replace(/\.scss$/, '')
    let task = []

    // 说明不是scss文件
    if (origin === target) {
      return
    }

    task = options.output.map(style => {
      let ext = '.css'

      switch (style) {
        case 'compressed':
          ext = '.min' + ext
          break
        default:
          ext = style.slice(0, 1) + ext
      }

      return { style, output: target + ext }
    })

    // 编译单一类型, 则去掉文件名微调
    if (task.length === 1) {
      task[0].output = target + '.css'
    }

    task = task.map(item => {
      return compileScss(item.style, origin, item.output)
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
      if (options.exclude.test(origin)) {
        return
      }
    }

    this.compile(doc)
  }
}

function __init__() {
  let conf = vsc.workspace.getConfiguration('Scss2css')
  let folders = vsc.workspace.workspaceFolders
  let wsDir = ''
  let configFile = ''

  Object.assign(options, conf)
  conf = null

  options.output = options.output.split('|').map(it => it.trim())

  if (folders && folders.length) {
    wsDir = folders[0].uri.path
  }

  if (wsDir) {
    configFile = path.join(wsDir, '.scssrc')
  } else {
    let editor = vsc.window.activeTextEditor
    if (editor) {
      wsDir = path.dirname(editor.document.fileName)
      configFile = path.join(wsDir, '.scssrc')
    }
  }

  // 以配置文件所在目录为根目录(workspace)
  if (fs.exists(configFile)) {
    options.workspace = path.dirname(configFile)

    let tmp = JSON.parse(fs.cat(configFile).toString())

    Object.assign(options, tmp)
    tmp = null

    if (options.outdir) {
      options.outdir = path.join(options.workspace, options.outdir)
    }
  }

  if (options.exclude) {
    options.exclude = new RegExp(options.exclude, 'i')
  }

  prefixer = postcss().use(
    autoprefixer({
      browsers: options.browsers
    })
  )
}

function deactivate() {}

exports.activate = function(ctx) {
  __init__()

  vsc.workspace.onDidChangeConfiguration(__init__)

  vsc.workspace.onDidSaveTextDocument(doc => {
    std.clear()
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
exports.deactivate = deactivate
